import React from 'react';
import '../styles/userview.css';

function UserView({ user }) {
	return (
		<div className="container-user">
			<span className="span">
				<p>Name</p>
				<p>{user.fullname}</p>
			</span>

			<span className="span">
				<p>Total Available Day Off</p>
				<p>{user.totalday}</p>
			</span>

			<span className="span">
				<p>Taken Day Off</p>
				<p>{user.takenday}</p>
			</span>

			<span className="span">
				<p>Remaining Day Off</p>
				<p>{user.remainingday}</p>
			</span>
		</div>
	);
}

export default UserView;
