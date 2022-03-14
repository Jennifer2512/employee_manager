import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import firebaseApp from './firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

function App() {
	const [user, setUser] = useState(null);

	async function getRol(uid) {
		const docuRef = doc(firestore, `users/${uid}`);
		const docuEncode = await getDoc(docuRef);
		const infoRol = docuEncode.data().rol;
		// if (typeof docuEncode.data().rol !== 'null') {
		// 	return infoRol;
		// } else {
		// 	alert('fail');
		// }
		const fullName = docuEncode.data().fullname;
		const totalDay = docuEncode.data().totalday;
		const takenDay = docuEncode.data().takenday;
		const remainingDay = docuEncode.data().remainingday;
		return [infoRol, fullName, totalDay, takenDay, remainingDay];
	}

	function setUserWithFirebaseAndRol(userFirebase) {
		getRol(userFirebase.uid).then((rol) => {
			const userData = {
				uid: userFirebase.uid,
				email: userFirebase.email,
				rol: rol[0],
				fullname: rol[1],
				totalday: rol[2],
				takenday: rol[3],
				remainingday: rol[4]
			};
			setUser(userData);
		});
	}

	onAuthStateChanged(auth, (userFirebase) => {
		if (userFirebase) {
			if (!user) {
				setUserWithFirebaseAndRol(userFirebase);
			}
		} else {
			setUser(null);
		}
	});

	return (
		<Routes>
			<Route path="/" exact element={user ? <Home user={user} /> : <Login />} />
			<Route path="forgot-password" element={<ForgotPassword />} />
		</Routes>
	);
}

export default App;
