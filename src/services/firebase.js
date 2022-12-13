import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { getAuth, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, doc, updateDoc, getDoc, getDocs, setDoc, query, where, getCountFromServer, limit, startAfter, orderBy  } from 'firebase/firestore';
import firebaseConfig from "./config";
import slugify from 'slugify';
import { FileImageFilled } from '@ant-design/icons';
import { all } from 'redux-saga/effects';
import _ from 'lodash';

class Firebase {
  constructor() {
    const app = initializeApp(firebaseConfig);

    this.storage = getStorage(app);
    this.auth = getAuth(app);
    this.db = getFirestore(app);
  }

  // AUTH ACTIONS ------------

  createAccount = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  signIn = (email, password) =>
    signInWithEmailAndPassword(this.auth, email, password);

  signInWithGoogle = () =>
    this.auth.signInWithPopup(new app.auth.GoogleAuthProvider());

  signInWithFacebook = () =>
    this.auth.signInWithPopup(new app.auth.FacebookAuthProvider());

  signInWithGithub = () =>
    this.auth.signInWithPopup(new app.auth.GithubAuthProvider());

  signOut = () => signOut(this.auth);

  passwordReset = (email) => this.auth.sendPasswordResetEmail(email);

  addUser = (id, user) => setDoc(doc(collection(this.db, "users"), id), user);

  getUser = (id) => getDoc(doc(collection(this.db, "users"), id));

  passwordUpdate = (password) => this.auth.currentUser.updatePassword(password);

  changePassword = (currentPassword, newPassword) =>
    new Promise((resolve, reject) => {
      this.reauthenticate(currentPassword)
        .then(() => {
          const user = this.auth.currentUser;
          user
            .updatePassword(newPassword)
            .then(() => {
              resolve("Password updated successfully!");
            })
            .catch((error) => reject(error));
        })
        .catch((error) => reject(error));
    });

  reauthenticate = (currentPassword) => {
    const user = this.auth.currentUser;
    const cred = app.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    return user.reauthenticateWithCredential(cred);
  };

  updateEmail = (currentPassword, newEmail) =>
    new Promise((resolve, reject) => {
      this.reauthenticate(currentPassword)
        .then(() => {
          const user = this.auth.currentUser;
          user
            .updateEmail(newEmail)
            .then(() => {
              resolve("Email Successfully updated");
            })
            .catch((error) => reject(error));
        })
        .catch((error) => reject(error));
    });

  updateProfile = (id, updates) => updateDoc(doc(this.db, "users", id), updates);

  onAuthStateChanged = () =>
    new Promise((resolve, reject) => {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          resolve(user);
        } else {
          reject(new Error("Auth State Changed failed"));
        }
      });
    });d

  saveBasketItems = (items, userId) => updateDoc(doc(this.db, "users", userId), {basket: items});
  
  setAuthPersistence = () =>
    this.auth.setPersistence(app.auth.Auth.Persistence.LOCAL);

  // // CONTENT ACTIONS --------------
  getRotatorPanels = async (activeOnly = 1, itemsCount = 12) => {
    try
    {      
      const contentRef = collection(this.db, "rotator_pages");
      const fq = activeOnly 
        ? query(contentRef, where("isActive", "==", true), orderBy("sort", "asc"), limit(itemsCount))
        : query(contentRef, orderBy("sort", "asc"), limit(itemsCount));
  
      const snapshot = await getDocs(fq);
      let results = [];
      snapshot.forEach((doc) => {
        // results.push({id: doc.id, data: doc.data()});
        results.push(doc.data());
      });
      return results;
    }
    catch (err) {
      console.error(err);
    }
  }

  // // PRODUCT ACTIONS --------------

  getSingleProduct = async (id) => {
    try
    {
      const productsRef = collection(this.db, "products");
      const docQuery = query(productsRef, where("id", "==", id));
      const docSnap = await getDocs(docQuery);
    
      let match = null;
      docSnap.forEach(doc => match = doc.data());
      return match;
    }
    catch (err) {
      console.error(err);
    }
  }

  getProducts = (lastRefKey) => {
    let didTimeout = false;
    const productsRef = collection(this.db, "products");
  
    return new Promise((resolve, reject) => {
      (async () => {
        if (lastRefKey) {
          try {
            const query = query(productsRef, startAfter(lastRefKey), orderBy("id"), limit(12));
            const snapshot = await query.getDocs();
            const products = [];
            snapshot.forEach((doc) =>
              products.push({ id: doc.id, ...doc.data() })
            );
            const lastKey = snapshot.docs[snapshot.docs.length - 1];
            resolve({ products, lastKey });
          } catch (e) {
            reject(e?.message || ":( Failed to fetch products.");
          }
        } else {
          const timeout = setTimeout(() => {
            didTimeout = true;
            reject(new Error("Request timeout, please try again"));
          }, 15000);

          try {
            const countSnapshot = await getCountFromServer(productsRef);
            const total =  countSnapshot.data().count;

            const docQuery = query(productsRef, orderBy("id"), limit(12));
            const snapshot = await getDocs(docQuery);

            clearTimeout(timeout);

            if (!didTimeout) {
              let products = [];
              snapshot.forEach((doc) => {
                products.push(doc.data());
              });
              const lastKey = snapshot.docs[snapshot.docs.length - 1];
              
              resolve({ products: _.uniqBy(products, 'id'), lastKey, total });
            }
          } catch (e) {
            if (didTimeout) return;
            reject(e?.message || ":( Failed to fetch products.");
          }
        }
      })();
    });
  };

  searchProducts = (searchKey) => {
    let didTimeout = false;

    return new Promise((resolve, reject) => {
      (async () => {
        const timeout = setTimeout(() => {
          didTimeout = true;
          reject(new Error("Request timeout, please try again"));
        }, 15000);

        try {
          const productsRef = collection(this.db, "products");
          const keywordQuery = query(productsRef,            
                where("keywords", "array-contains-any", searchKey.split(" ")),
                orderBy("name_lower"),
                orderBy("popularity", "desc"),
                limit(12));

            const nameQuery = query(productsRef,                          
              where("name_lower", ">=", searchKey),
              where("name_lower", "<=", `${searchKey}\uf8ff`),
              orderBy("name_lower"),
              orderBy("popularity", "desc"),
              limit(12));
            
          const keywordsSnaps = await getDocs(keywordQuery);
          const namedSnaps = await getDocs(nameQuery);
                    
          clearTimeout(timeout);

          if (!didTimeout) {
            let lastKey = null;          
            let products = [];
            
            if (!keywordsSnaps.empty) {
              keywordsSnaps.forEach((doc) => {
                products.push(doc.data());
              });
            }

            namedSnaps.forEach((doc) => {
              products.push(doc.data());
            });

            resolve({ products: _.uniqBy(products, 'id') });
          }
        } catch (e) {
          if (didTimeout) return;
          reject(e);
        }
      })();
    });
  };

  getCrossSellProducts = async (terms, maxRecords = 12) => {
    try {
      const productsRef = collection(this.db, "products");
      const keywordQuery = query(productsRef,            
            where("keywords", "array-contains-any", terms),
            orderBy("popularity", "desc"),
            limit(maxRecords));

      const keywordsSnaps = await getDocs(keywordQuery);
      let products = [];            
      keywordsSnaps.forEach((doc) => {
        products.push(doc.data());
      });
      return products;  
    } catch (err) {
      console.error(err);
    }
  }

  getFeaturedProducts = async (itemsCount = 12) => {
    try
    {      
      const productsRef = collection(this.db, "products");
      const fq = query(productsRef,
        where("isFeatured", "==", true),
        orderBy("popularity", "desc"),
        limit(itemsCount));
  
      const snapshot = await getDocs(fq);
      let results = [];
      snapshot.forEach((doc) => {
        // results.push({id: doc.id, data: doc.data()});
        results.push(doc.data());
      });
      return results;
    }
    catch (err) {
      console.error(err);
    }
  }


  getRecommendedProducts = async (itemsCount = 12) => {
    try
    {      
      const productsRef = collection(this.db, "products");
      const fq = query(productsRef,
        where("isRecommended", "==", true),
        orderBy("popularity", "desc"),
        limit(itemsCount));
  
      const snapshot = await getDocs(fq);
      let results = [];
      snapshot.forEach((doc) => {
        // results.push({id: doc.id, data: doc.data()});
        results.push(doc.data());
      });
      return results;
    }
    catch (err) {
      console.error(err);
    }
  }
  
  addProductImage = async (product, image ) => {
    const nameParts = image.file.name.split('.');
    const imagePath = `${slugify(nameParts[0], {lower:true})}.${nameParts[1]}`;
    const imageRef = ref(this.storage, `images/${product.id}/${imagePath}`);

    const snapshot = await uploadBytes(imageRef, image.file, {contentType: image.file.type});
    const url = await getDownloadURL(snapshot.ref);
    return url;
  }
  
  addNewProduct = async (product, imageCollection) => {
    let imageRefs = [];

    imageCollection.forEach(async image => {
      const url = await this.addProductImage(product, image);
      imageRefs.push(url);
    });
    product.images = imageRefs;
    console.log('saving product...');
    console.dir(product);
    setDoc(doc(collection(this.db, "products"), product.id), product);
  } 

  deleteImage = (id) => this.storage.ref("products").child(id).delete();

  editProduct = (id, updates) =>
    this.db.collection("products").doc(id).update(updates);

  removeProduct = (id) => this.db.collection("products").doc(id).delete();
}

const firebaseInstance = new Firebase();
export default firebaseInstance;
