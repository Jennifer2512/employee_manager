import React from 'react';
import '../styles/adminview.css';
import Tabs from '../components/Tabs';

function AdminView({user}) {
	return (
		<div>
			<Tabs user={user}/>
		</div>
	);
}

export default AdminView;
