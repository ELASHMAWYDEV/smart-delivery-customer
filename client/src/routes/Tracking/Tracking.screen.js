import { useEffect, useState, useCallback, memo } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useParams } from 'react-router-dom';
import useTracking from './hooks';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { useTranslation } from 'react-i18next';
import IO from 'socket.io-client';

//Styles
import './style.scss';
import 'react-notifications/lib/notifications.css';

//Socket Connection
const socket = IO(process.env.REACT_APP_SOCKET_URI);

const Tracking = () => {
	const { i18n, t } = useTranslation('translations');
	const { getOrderData } = useTracking();
	const { orderId } = useParams();
	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
	});

	const [map, setMap] = useState(null);

	const onLoad = useCallback((map) => {
		const bounds = new window.google.maps.LatLngBounds();
		map.fitBounds(bounds);
		setMap(map);
	}, []);

	const onUnmount = useCallback(function callback(map) {
		setMap(null);
	}, []);

	const [data, setData] = useState({
		dropOffLat: 0,
		dropOffLong: 0,
		branchLat: 0,
		branchLng: 0,
		branchLogo: '',
		branchName: '',
		receiverAddress: '',
		paidToClient: 0,
	});
	const [driverData, setDriverData] = useState({ lat: 0, lng: 0 });

	useEffect(() => {
		/*****************************************************/
		//join the socket
		socket.emit('JoinCustomer', { orderId });

		socket.on('JoinCustomer', (data) => {
			console.log(data);
			if (!data.status) return alert(data.message || 'Error occurred');

			setDriverData(data.driverData);
		});

		socket.on('TrackOrder', (data) => {
			console.log('dirver updated location', data);
		});
		/*****************************************************/
		//Listen for any driver updates

		(async () => {
			try {
				let data = await getOrderData({ orderId });
				if (data.status) {
					setData(data.data);
				} else {
					NotificationManager.error(data.message);
				}

				console.log(data);
			} catch (e) {
				alert(e.message);
			}
		})();

		/*****************************************************/
	}, []);

	return (
		<div>
			<NotificationContainer />
			<div className="container tracking-container">
				<nav className="navbar navbar-expand-lg t-navbar">
					<a className="navbar-brand" href="#">
						<img src="assets/images/logo_b.png" alt="LogiOne Logo" className="w-100" />
						<span className="text-black push-10-l">Logie One</span>
					</a>
					<button
						className="navbar-toggler"
						type="button"
						data-toggle="collapse"
						data-target="#navbarSupportedContent"
						aria-controls="navbarSupportedContent"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="navbar-toggler-icon"></span>
					</button>

					<div
						className="collapse navbar-collapse"
						id="navbarSupportedContent"
						style={{ display: 'flex', flex: 1 }}
					>
						<ul className="navbar-nav ml-auto">
							<li className="nav-item">
								<a
									className="nav-link text-dark"
									href="#"
									onClick={(e) => {
										e.preventDefault();
										i18n.changeLanguage(i18n.language == 'ar' ? 'en' : 'ar');
									}}
								>
									<i className="ion-earth push-5-r"></i> {i18n.language == 'ar' ? 'En' : 'عربي'}
								</a>
							</li>
						</ul>
					</div>
				</nav>

				<section className="wrapper">
					<div className="row">
						<div className="col-md-8">
							<div className="map_wrap">
								<div className="map-container">
									{isLoaded && (
										<GoogleMap
											options={{
												gestureHandling: 'greedy',
												streetViewControl: true,
												fullscreenControl: true,
											}}
											mapContainerStyle={{ width: '100%', height: '100%' }}
											center={{
												lat: driverData.lat,
												lng: driverData.lng,
											}}
											zoom={10}
											onLoad={onLoad}
											onUnmount={onUnmount}
											clickableIcons
										>
											<Marker
												position={{ lat: data.dropOffLat, lng: data.dropOffLong }}
												clickable
												onClick={() => {
													map.panTo({ lat: data.dropOffLat, lng: data.dropOffLong });
												}}
												icon={{
													url: 'assets/images/Map_icons/home.png',
													size: new window.google.maps.Size(50, 60),
													scaledSize: new window.google.maps.Size(50, 60),
												}}
											/>
											<Marker
												position={{ lat: driverData.lat, lng: driverData.lng }}
												clickable
												onClick={() => {
													map.panTo({ lat: driverData.lat, lng: driverData.lng });
												}}
												icon={{
													url: 'assets/images/Map_icons/delivery.png',
													size: new window.google.maps.Size(50, 60),
													scaledSize: new window.google.maps.Size(50, 60),
												}}
											/>
											<Marker
												position={{ lat: data.branchLat, lng: data.branchLng }}
												clickable
												onClick={() => {
													map.panTo({ lat: data.branchLat, lng: data.branchLng });
												}}
												icon={{
													url: 'assets/images/Map_icons/store.png',
													size: new window.google.maps.Size(50, 60),
													scaledSize: new window.google.maps.Size(50, 60),
												}}
											/>
										</GoogleMap>
									)}
								</div>
							</div>
						</div>
						<div className="col-md-4">
							<div className="cont_wrap">
								<h4 className="text-primary">{t('RESTAURANT')}</h4>
								<table className="table">
									<tr>
										<td>
											<img src={data.branchLogo} style={{ width: 50, borderRadius: 5 }} />
											<span className="push-10-l">{data.branchName}</span>
										</td>
									</tr>
									<tr>
										<td>
											<h6 className="remove-margin">{t('LOCATION')}</h6>
											<p className="remove-margin">{data.receiverAddress}</p>
										</td>
									</tr>
								</table>

								<h4 className="text-primary">{t('CAPTAIN')}</h4>
								<table className="table">
									<tr>
										<td>
											<h6 className="remove-margin">{t('NAME')}</h6>
											<p className="remove-margin">
												{i18n.language == 'ar'
													? driverData.driverNameEn
													: driverData.driverNameEn}
											</p>
										</td>
									</tr>
									<tr>
										<td>
											<h6 className="remove-margin">{t('MOBILE_CALL')}</h6>
											<p className="remove-margin">{driverData.phoneNumber}</p>
										</td>
										<td className="text-right">
											<a
												href={`https://api.whatsapp.com/send?phone=${driverData.phoneNumber}&text=مرحبا ${driverData.driverNameAr}`}
												className="number_a whatsapp"
											>
												<i className="bi bi-whatsapp"></i>
											</a>
											<a href={`tel:${driverData.phoneNumber}}`} className="number_a call">
												<i className="bi bi-telephone"></i>
											</a>
										</td>
									</tr>
								</table>
								<h4 className="text-primary">{t('ORDER_DETAILS')}</h4>
								<table className="table">
									<tr>
										<td>
											<h6 className="remove-margin">{t('ID')}</h6>
											<p className="remove-margin">#{data.orderId}</p>
										</td>
									</tr>
									<tr>
										<td>
											<h6 className="remove-margin">{t('COST')}</h6>
											<p className="remove-margin text-primary">
												<strong>
													{data.receiverCollected} {data.currency}
												</strong>
											</p>
										</td>
									</tr>
								</table>
							</div>
						</div>
					</div>
				</section>

				<section className="footer text-center">
					<p className="remove-margin text-white">© 2021 LogiOne Inc.</p>
				</section>
			</div>
		</div>
	);
};

export default memo(Tracking);
