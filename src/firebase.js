import { initializeApp } from 'firebase/app';

const firebaseConfig = {
	apiKey: 'AIzaSyACrvO6gcfne3zKMQH5CzS_NrBRfSIHLoE',
	authDomain: 'employee-manager-349ef.firebaseapp.com',
	projectId: 'employee-manager-349ef',
	storageBucket: 'employee-manager-349ef.appspot.com',
	messagingSenderId: '584044555183',
	appId: '1:584044555183:web:65ed1881da3847f2c49d5a'
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;