import React from 'react';
import AdminView from '../components/AdminView';
import UserView from '../components/UserView';
import firebaseApp from '../firebase';
import { getAuth, signOut } from 'firebase/auth';
import { Button } from 'react-bootstrap';
import '../styles/home.css';
const auth = getAuth(firebaseApp);

function Home({ user }) {
	return (
		<>
			<div className="container-view">
				<h5>Home</h5>
				<p>Welcome, {user.email}</p>
				<Button variant="primary" size="sm" onClick={() => signOut(auth)}>
					Sign Out
				</Button>
			</div>
			{user.rol === 'admin' ? (
				<AdminView user={user} />
			) : (
				<UserView user={user} />
			)}
		</>
	);
}
export default Home;
