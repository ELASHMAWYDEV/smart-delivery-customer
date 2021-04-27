import { useEffect, useState } from 'react';
import axios from 'axios';

const useTrakcing = () => {
	const getOrderData = async ({ orderId }) => {
		try {
			let response = await axios.post(
				`${process.env.REACT_APP_API_URI}/Trip/TrackingOrderDetails?orderId=${orderId.toString()}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${process.env.REACT_APP_API_SECRET_KEY}`,
					},
				}
			);

			let data = await response.data;
			return data;
		} catch (e) {
			alert(e.message);
		}
	};

	return {
		getOrderData,
	};
};

export default useTrakcing;
