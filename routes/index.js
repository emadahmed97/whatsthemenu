const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const storeReviewController = require('../controllers/storeReviewController');
const menuItemController = require('../controllers/menuItemController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/page/:page', catchErrors(storeController.getStores));

router.get('/add', authController.isLoggedIn, storeController.addStore);

router.post('/add',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
);

router.post('/add/:id',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore)
);

router.get('/stores/:id/edit', catchErrors(storeController.editStore));
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

router.get('/login', userController.loginForm);
router.get('/auth/facebook', authController.loginFacebook);
router.get('/auth/facebook/callback', authController.loginFacebookCallback);
router.post('/login', authController.login);
router.get('/register', userController.registerForm);

router.post('/register',
  userController.validateRegister,
  userController.register,
  authController.login
);

router.get('/logout', authController.logout);

router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token',
  authController.confirmedPasswords,
  catchErrors(authController.update)
);
router.get('/map', storeController.mapPage);
router.get('/hearts', storeController.heartedStoresList);
router.post('/reviews/:id', authController.isLoggedIn, catchErrors(storeReviewController.addReview));
router.get('/topstores', catchErrors(storeController.getTopStores));

router.get('/menuitems', authController.isLoggedIn, catchErrors(menuItemController.menuItemsList));
router.get('/menuitems/add', authController.isLoggedIn, catchErrors(menuItemController.editMenuItem));
router.post('/menuitems/add',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(menuItemController.getStoreBySlug),
  catchErrors(menuItemController.createMenuItem)
);
router.get('/menuitems/item/:slug', catchErrors(menuItemController.getMenuItem));
router.post('/menuitems/reviews/:id', catchErrors(menuItemController.createReview));
router.get('/topitems', catchErrors(menuItemController.getTopItems));

// APIs
router.get('/api/search', catchErrors(storeController.searchStores));
router.get('/api/stores/near', catchErrors(storeController.mapStores));
router.post('/api/stores/:id/heart', authController.isLoggedIn, catchErrors(storeController.heartStore));
router.post('/api/items/:id/heart', authController.isLoggedIn, catchErrors(menuItemController.heartItem));
router.post('/api/stores/menuitem/:id', catchErrors(menuItemController.getStores));
router.get('/api/stores/menuitem/:id', catchErrors(menuItemController.getStores));


module.exports = router;
