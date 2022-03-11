import React, { useState, useEffect } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import firebaseApp from '../firebase';
import { Link } from 'react-router-dom';

const auth = getAuth(firebaseApp);
function ForgotPassword() {
	const [mess, setMess] = useState('');
	const initialValues = { email: '', password: '' };
	const [formValues, setFormValues] = useState(initialValues);
	const [formErrors, setFormErrors] = useState({});
	const [isSubmit, setIsSubmit] = useState(false);
	const [error, setError] = useState('');

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormValues({ ...formValues, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMess('');
		setFormErrors(validate(formValues));
		const usernotfound = /user-not-found/;
		const email = e.target.elements.email.value;
		setIsSubmit(true);
		try {
			await sendPasswordResetEmail(auth, email);
			setMess('Please check your email!');
		} catch (err) {
			setError(err.message);
			if (usernotfound.test(err.message)) {
				setError('*User not found');
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
		return errors;
	};

	return (
		<div className="pe-container">
			<form className="container-form" onSubmit={handleSubmit}>
				<h4>Password Reset</h4>
				{mess && (
					<Alert variant="success" size="sm">
						{mess}
					</Alert>
				)}

				{Object.keys(formErrors).length === 0 && isSubmit ? (
					<p className="error">{error}</p>
				) : (
					<p className="error">{formErrors.email}</p>
				)}
				<div className="span-div">
					<label className="label">Email Address:</label>
					<input
						type="text"
						name="email"
						value={formValues.email}
						onChange={handleChange}
					/>
				</div>
				<Button variant="primary" type="Submit">
					Reset Password
				</Button>
			</form>
			<div className="forgot-pass">
				Already have account? <Link to="/">Login</Link>
			</div>
		</div>
	);
}

export default ForgotPassword;
