import React, { useState, useEffect } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import secondaryApp from '../secondFirebase';
function Signup() {
	const initialValues = { email: '', password: '' };
	const [formValues, setFormValues] = useState(initialValues);
	const [formErrors, setFormErrors] = useState({});
	const [isSubmit, setIsSubmit] = useState(false);
	const [error, setError] = useState('');
	const [mess, setMess] = useState('');
	const firestore = getFirestore(secondaryApp);
	const auth = getAuth(secondaryApp);
	async function Signup(
		email,
		password,
		rol,
		fullname,
		totalday,
		takenday,
		remainingday
	) {
		const infoUser = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		).then(function (userFirebase) {
			console.log('User ' + userFirebase.uid + ' created successfully!');
			return userFirebase;
		});
		const docuRef = doc(firestore, `users/${infoUser.user.uid}`);
		setDoc(docuRef, {
			email: email,
			rol: rol,
			fullname: fullname,
			totalday: Number(totalday),
			takenday: Number(takenday),
			remainingday: Number(totalday - takenday)
		});
	}

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormValues({ ...formValues, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMess('');
		setFormErrors(validate(formValues));
		const emailalreadyinuse = /email-already-in-use/;
		const email = e.target.elements.email.value;
		const password = e.target.elements.password.value;
		const rol = e.target.elements.rol.value;
		const fullname = e.target.elements.fullname.value;
		const totalday = e.target.elements.totalday.value;
		const takenday = e.target.elements.takenday.value;
		const remainingday = totalday - takenday;
		setIsSubmit(true);
		try {
			await Signup(
				email,
				password,
				rol,
				fullname,
				totalday,
				takenday,
				remainingday
			);
			setMess('Registration Success');
		} catch (err) {
			if (emailalreadyinuse.test(err.message)) {
				setError('*Email already in use');
			}
		}
	};

	useEffect(() => {
		if (Object.keys(formErrors).length === 0 && isSubmit) {
		}
	}, [formErrors]);

	const validate = (values) => {
		const errors = {};
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
		if (!values.email) {
			errors.email = '*Email is required!';
		} else if (!regex.test(values.email)) {
			errors.email = '*This is not a valid email format!';
		}
		if (!values.password) {
			errors.password = '*Password is required';
		} else if (values.password.length < 6) {
			errors.password = '*Password must be more than 6 characters';
		} else if (values.password.length > 50) {
			errors.password = '*Password cannot exceed more than 50 characters';
		}
		if (!values.fullname) {
			errors.fullname = '*Fullname is required!';
		}
		return errors;
	};

	return (
		<div className="pe-container-signup">
			<form className="container-form" onSubmit={handleSubmit}>
				<h4>New account</h4>
				{mess && (
					<Alert variant="success" size="sm" className="mt-2">
						{mess}
					</Alert>
				)}
				<div className="span-div">
					<label className="label">Email Address:</label>
					<input type="text" id="email" name="email" onChange={handleChange} />
				</div>
				{Object.keys(formErrors).length === 0 && isSubmit ? (
					<p className="error">{error}</p>
				) : (
					<p className="error">{formErrors.email}</p>
				)}
				<div className="span-div">
					<label className="label">Password:</label>
					<input
						type="password"
						id="password"
						name="password"
						onChange={handleChange}
					/>
				</div>
				<p className="error">{formErrors.password}</p>

				<div className="span-div">
					<label className="label">Full Name:</label>
					<input
						type="text"
						id="fullname"
						name="fullname"
						onChange={handleChange}
					/>
				</div>
				<p className="error">{formErrors.fullname}</p>

				<div className="span-div">
					<label className="label">Rol:</label>
					<select id="rol">
						<option value="admin">Admin</option>
						<option value="user">User</option>
					</select>
				</div>

				<div className="span-div">
					<label className="label">Total Day Off:</label>
					<input type="number" id="totalday" min="1" max="9999" maxLength="4" />
				</div>

				<div className="span-div">
					<label className="label">Taken Day Off:</label>
					<input type="number" id="takenday" min="1" max="9999" maxLength="4" />
				</div>

				<Button variant="primary" type="submit">
					Create new account
				</Button>
			</form>
		</div>
	);
}

export default Signup;
