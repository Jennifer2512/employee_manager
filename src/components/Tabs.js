import React, { useEffect, useState } from 'react';
import '../styles/tabs.css';
import Signup from '../pages/Signup';
import {
	getFirestore,
	getDocs,
	where,
	query,
	collection,
	doc,
	deleteDoc,
	updateDoc
} from 'firebase/firestore';
import firebaseApp from '../firebase';
import { Button } from 'react-bootstrap';
import HeaderRow from './HeaderRow';

function Tabs() {
	const firestore = getFirestore(firebaseApp);
	const [toggleState, setToggleState] = useState(1);
	const [users, setUsers] = useState([]);
	const toggleTab = (index) => {
		setToggleState(index);
	};

	// get doc and detele doc
	const usersCollectionRef = query(
		collection(firestore, 'users'),
		where('rol', '==', 'user')
	);
	const getUsers = async () => {
		const data = await getDocs(usersCollectionRef);
		setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
	};

	useEffect(() => {
		getUsers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const deleteUser = async (id) => {
		const userDoc = doc(firestore, 'users', id);
		await deleteDoc(userDoc);
		getUsers();
	};

	// Total
	const increaseTotal = async (id, totalday, remainingday) => {
		const userDoc = doc(firestore, 'users', id);
		const newFields = {
			totalday: totalday + 1,
			remainingday: remainingday + 1
		};
		await updateDoc(userDoc, newFields);
		getUsers();
	};
	const decreaseTotal = async (id, totalday, remainingday) => {
		const userDoc = doc(firestore, 'users', id);
		const newFields = {
			totalday: totalday - 1,
			remainingday: remainingday - 1
		};
		await updateDoc(userDoc, newFields);
		getUsers();
	};
	// Taken
	const increaseTaken = async (id, takenday, remainingday) => {
		const userDoc = doc(firestore, 'users', id);
		const newFields = {
			takenday: takenday + 1,
			remainingday: remainingday - 1
		};
		await updateDoc(userDoc, newFields);
		getUsers();
	};
	const decreaseTaken = async (id, takenday, remainingday) => {
		const userDoc = doc(firestore, 'users', id);
		const newFields = {
			takenday: takenday - 1,
			remainingday: remainingday + 1
		};
		await updateDoc(userDoc, newFields);
		getUsers();
	};

	function someFunc() {
		toggleTab(1);
		getUsers();
	}

	return (
		<div>
			<div className="bloc-tabs">
				<button
					className={toggleState === 1 ? 'tabs active-tabs' : 'tabs'}
					onClick={someFunc}
				>
					<p>Users</p>
				</button>
				<button
					className={toggleState === 2 ? 'tabs active-tabs' : 'tabs'}
					onClick={() => toggleTab(2)}
				>
					<p>Create new account</p>
				</button>
			</div>

			<div className="content-tabs">
				<div className={toggleState === 1 ? 'active-content' : 'content'}>
					<div className="container-admin">
						<HeaderRow />
						{users.map((user, index) => {
							return (
								<div className="container-box-user">
									<div className="info">
										<p className="mobile">#:</p>
										<p>{index + 1}</p>
									</div>
									<div className="info">
										<p className="mobile">Name:</p>
										<p>{user.fullname}</p>
									</div>
									<div className="info">
										<p className="mobile">Total day:</p>
										<div
											className={
												user.totalday >= 1 ? 'info-items' : 'info-items1'
											}
										>
											<button
												className={user.totalday >= 1 ? '' : 'dis'}
												onClick={() =>
													decreaseTotal(
														user.id,
														user.totalday,
														user.remainingday
													)
												}
											>
												-
											</button>
											<p>{user.totalday}</p>
											<button
												onClick={() =>
													increaseTotal(
														user.id,
														user.totalday,
														user.remainingday
													)
												}
											>
												+
											</button>
										</div>
									</div>

									<div className="info">
										<p className="mobile">Taken day:</p>
										<div
											className={
												user.takenday >= 1 ? 'info-items' : 'info-items1'
											}
										>
											<button
												className={user.takenday >= 1 ? '' : 'dis'}
												onClick={() =>
													decreaseTaken(
														user.id,
														user.takenday,
														user.remainingday
													)
												}
											>
												-
											</button>
											<p>{user.takenday}</p>
											<button
												onClick={() =>
													increaseTaken(
														user.id,
														user.takenday,
														user.remainingday
													)
												}
											>
												+
											</button>
										</div>
									</div>
									<div className="info">
										<p className="mobile">Remaining day:</p>
										<div
											className={
												user.remainingday >= 1 ? 'info-name' : 'info-red'
											}
										>
											<p>{user.remainingday}</p>
										</div>
									</div>
									<div className="btn-action">
										<Button
											variant="danger"
											onClick={() => {
												deleteUser(user.id);
											}}
										>
											Delete
										</Button>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			<div className={toggleState === 2 ? 'active-content' : 'content'}>
				<Signup />
			</div>
		</div>
	);
}

export default Tabs;
