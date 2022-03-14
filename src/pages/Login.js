import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import firebaseApp from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const auth = getAuth(firebaseApp);

function Login() {
	const initialValues = { email: '', password: '' };
	const [formValues, setFormValues] = useState(initialValues);
	const [formErrors, setFormErrors] = useState({});
	const [isSubmit, setIsSubmit] = useState(false);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormValues({ ...formValues, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setFormErrors(validate(formValues));
		const email = e.target.elements.email.value;
		const password = e.target.elements.password.value;
		const usernotfound = /user-not-found/;
		setIsSubmit(true);
		try {
			await signInWithEmailAndPassword(auth, email, password);
			navigate('/');
		} catch (err) {
			if (usernotfound.test(err.message)) {
				setError('*User not found');
			} else {
				setError('*Wrong Password');
			}
		}
	};

	useEffect(() => {
		if (Object.keys(formErrors).length === 0 && isSubmit) {
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formErrors]);

	const validate = (values) => {
		const errors = {};
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
		if (!values.email) {
			errors.email = '*Email is required!';
		} else if (!regex.test(values.email)) {
			errors.email = '*This is not a valid email format!';
		} else if (!values.password) {
			errors.password = '*Password is required';
		} else if (values.password.length < 6) {
			errors.password = '*Password must be more than 6 characters';
		} else if (values.password.length > 50) {
			errors.password = '*Password cannot exceed more than 50 characters';
		}
		return errors;
	};

	return (
		<div className="pe-container">
			<form className="container-form" onSubmit={handleSubmit}>
				<h4>Login</h4>
				<div className="span-div">
					<label className="label">Email Address:</label>
					<input
						type="text"
						name="email"
						value={formValues.email}
						onChange={handleChange}
					/>
				</div>

				<div className="span-div">
					<label className="label">Password:</label>
					<input
						type="password"
						name="password"
						value={formValues.password}
						onChange={handleChange}
					/>
				</div>
				<p className="error">{formErrors.password}</p>
				{Object.keys(formErrors).length === 0 && isSubmit ? (
					<p className="error">{error}</p>
				) : (
					<p className="error">{formErrors.email}</p>
				)}
				<Button variant="primary" type="submit">
					Login
				</Button>
			</form>
			<Link className="forgot-pass" to="/forgot-password">
				Forgot Password?
			</Link>
		</div>
	);
}

export default Login;
