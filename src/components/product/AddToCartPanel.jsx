import {ButtonToolbar, DropdownButton, ButtonGroup, Button, MenuItem, Panel } from 'react-bootstrap';

const AddToCartPanel = (product) => {
  const options = (product.options || []).length > 0 
    ? <ButtonGroup><DropdownButton>Options{product.options.map((o,i)=><MenuItem key={o.name}>`${o.label}`</MenuItem>)}</DropdownButton></ButtonGroup>
    : <></>;
}