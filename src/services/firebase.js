import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, query, where, getCountFromServer, limit, startAfter, orderBy  } from 'firebase/firestore';
import firebaseConfig from "./config";
import slugify from 'slugify';
import { FileImageFilled } from '@ant-design/icons';
import { all } from 'redux-saga/effects';

class Firebase {
  constructor() {
    const app = initializeApp(firebaseConfig);

    this.storage = getStorage(app);
    this.auth = getAuth(app);
    this.db = getFirestore(app);

    // this.ravenDb = new DocumentStore('https://a.myc-dev.totable.ravendb.cloud', 'KitchenOnTheCorner');
    // this.ravenDb.initialize();
  }

  // AUTH ACTIONS ------------

  createAccount = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  signIn = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  signInWithGoogle = () =>
    this.auth.signInWithPopup(new app.auth.GoogleAuthProvider());

  signInWithFacebook = () =>
    this.auth.signInWithPopup(new app.auth.FacebookAuthProvider());

  signInWithGithub = () =>
    this.auth.signInWithPopup(new app.auth.GithubAuthProvider());

  signOut = () => this.auth.signOut();

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

  updateProfile = (id, updates) =>
    this.db.collection("users").doc(id).update(updates);

  onAuthStateChanged = () =>
    new Promise((resolve, reject) => {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          resolve(user);
        } else {
          reject(new Error("Auth State Changed failed"));
        }
      });
    });

  saveBasketItems = (items, userId) =>
    this.db.collection("users").doc(userId).update({ basket: items });

  setAuthPersistence = () =>
    this.auth.setPersistence(app.auth.Auth.Persistence.LOCAL);

  // // PRODUCT ACTIONS --------------

  getSingleProduct = async (id) => {
    const docRef = doc(this.db, "products", id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
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
              const products = snapshot.docs.map(doc => doc.data());
              const lastKey = snapshot.docs[snapshot.docs.length - 1];
              
              resolve({ products, lastKey, total });
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
        const productsRef = collection(this.db, "products");

        const timeout = setTimeout(() => {
          didTimeout = true;
          reject(new Error("Request timeout, please try again"));
        }, 15000);

        try {
          debugger;
          const searchedKeywordsRef = query(productsRef,
            
            where("keywords", "array-contains-any", searchKey.split(" ")),
            limit(12));

            const searchedNameProducts = query(productsRef,
              
              where("name_lower", "<=", `${searchKey}\uf8ff`),
              limit(12));

            
          const keywordsSnaps = await getDocs(searchedKeywordsRef);
          const namedSnaps = await getDocs(searchedNameProducts);
          
          
          clearTimeout(timeout);
          if (!didTimeout) {
            const searchedNameProducts = [];
            const searchedKeywordsProducts = [];
            let lastKey = null;          
            let products = [];
            
            if (!keywordsSnaps.empty) {
              keywordsSnaps.forEach((doc) => {
                products.push(doc.data());
              });
            }
            keywordsSnaps.forEach((doc) => {
              // results.push({id: doc.id, data: doc.data()});
              products.push(doc.data());
            });
            resolve({ products});
          }
        } catch (e) {
          if (didTimeout) return;
          reject(e);
        }
      })();
    });
  };

  getFeaturedProducts = async (itemsCount = 12) => {
    try
    {      
      const productsRef = collection(this.db, "products");
      const fq = query(productsRef,
        where("isFeatured", "==", true),
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
      debugger;
      console.error(err);
    }
  }


  getRecommendedProducts = async (itemsCount = 12) => {
    try
    {      
      const productsRef = collection(this.db, "products");
      const fq = query(productsRef,
        where("isRecommended", "==", true),
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
      debugger;
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
