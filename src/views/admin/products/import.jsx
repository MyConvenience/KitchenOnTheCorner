/* eslint-disable react/jsx-props-no-spreading */
import { Boundary } from '@/components/common';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { selectFilter } from '@/selectors/selector';
import { ProductsNavbar } from '../components';
import { FileUploader } from "react-drag-drop-files";
import { DataSheetGrid, checkboxColumn, textColumn, floatColumn, keyColumn } from 'react-datasheet-grid';
import {parse} from 'papaparse';
import slugify from 'slugify';
import _ from 'lodash';
import { addProduct } from '@/redux/actions/productActions';

const fileTypes = ["CSV", "XLSX"];

const acceptImportLine = (line) => {
  const badAccounts = ["Sales", "Parts Purchases", "Service Sales", "Merchandise Sales:Auto Access"];

  return line["Active Status"] === "Active" 
        && line.MPN !== ""
        && badAccounts.indexOf(line.Account) === -1; 
}

const accountToKeywords = (account) => {
  const badWords = ['sales', 'tax', 'pkg', 'drinks'];
  const parts = account.toLowerCase().split(':');
  const lastPart = parts[parts.length - 1];
  const words = lastPart.split(" ");
  
  return words.filter(w => badWords.indexOf(w) === -1);
}

const mapProductLine = (line) => {
  const keywords = accountToKeywords(line.Account);
  const restricted = ['tobacco', 'beer', 'wine', 'cigar', 'alcohol', 'lottery'];
  const x = _.intersection(keywords, restricted);
  const isRestricted = x.length > 0;

  return {
    isValid: true,
    name: line.Item,
    isTaxable: line["Sales Tax Code"] === "Tax",
    isRestricted: isRestricted,
    account: line.Account,
    price: parseFloat(line.Price),
    upc: line.MPN,
    keywords: keywords.join(" ").toLowerCase().replace("alcohol", "beer")
  };
}

const ImportProducts = () => {
  const [file, setFile] = useState(null);
  const [importLines, setImportLines] = useState([]);
  const dispatch = useDispatch();
  useDocumentTitle('Product Import | KOTC Admin');
  useScrollTop();

  useEffect(()=>{
    if (file && importLines.length === 0) {
      console.dir(file);
      file.text().then(t => {
          const {data, errors} = parse(t, {header: true});
          const lines = data
                    .filter(acceptImportLine)
                    .map(mapProductLine);
          console.log(`Import filtering:  original ${data.length}  filtered: ${lines.length}`);
          setImportLines(lines);
        });
    }
  }, file);

  const importColumns = [
    { ...keyColumn('isValid', checkboxColumn), title: 'Valid' },
    { ...keyColumn('name', textColumn), title: 'Name' },
    { ...keyColumn('isTaxable', checkboxColumn), title: 'Taxable' },
    { ...keyColumn('isRestricted', checkboxColumn), title: 'Age Restricted' },
    { ...keyColumn('account', textColumn), title: 'Account' },
    { ...keyColumn('price', floatColumn), title: 'Price' },
    { ...keyColumn('upc', textColumn), title: 'UPC' },
    { ...keyColumn('keywords', textColumn), title: 'Keywords' }
  ];

  const store = useSelector((state) => ({
    filteredProducts: selectFilter(state.products.items, state.filter),
    requestStatus: state.app.requestStatus,
    isLoading: state.app.loading,
    products: state.products
  }));

  const performImport = () => {
    const products = importLines.filter(x => x.isValid).map(item => {
      const lowerName = item.name.toLowerCase();
      const keywords = item.keywords.split(" ");

      return {
        id: slugify(lowerName, {lower: true}),
        name: item.name,
        name_lower: lowerName,
        dateAdded: new Date().getTime(),
        description: '',
        upc: item.upc,
        isRestricted: item.isRestricted ? 21 : 0,
        isTaxable: item.isTaxable,
        keywords: keywords,
        crossSell: [],
        search: _.union(keywords, lowerName.split(" ")),
        image: null,
        images: [],
        isFeatured: false,
        popularity: 0,
        isRecommended: false,
        sizes: [{size: 'each', price: item.price}],
        options: []
      };
    });
    
    products.forEach(product => {
      dispatch(addProduct(product));
    });
  }


  return (
    <Boundary>
      <ProductsNavbar productsCount={store.products.items.length} totalProductsCount={store.products.total}/>
      <h1>Import Products</h1>
      {
        !file 
          ? <FileUploader handleChange={(file) => setFile(file)} name='file' types={fileTypes}/>
          : (<><div className="product-admin-items">
              <DataSheetGrid value={importLines} onChange={setImportLines} columns={importColumns}/>
            </div>
            <button
              className="button button-small"
              disabled={(importLines || []).length === 0}
              onClick={() => performImport()}
              type="button"
            >
              Start Import
            </button></>)
      }
    </Boundary>
  );}

export default withRouter(ImportProducts);