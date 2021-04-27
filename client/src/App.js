import { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
//Routes
import { Tracking } from './routes';

const App = () => {
	const { i18n } = useTranslation();

	let stylesEn = [
		'assets/css/bootstrap_en-.min.css',
		'assets/css/identity_en-.css',
		'assets/css/site_en-.css',
		'assets/css/media_en-.css',
	];
	let stylesAr = [
		'assets/css/bootstrap_ar-.min.css',
		'assets/css/identity_ar-.css',
		'assets/css/site_ar-.css',
		'assets/css/media_ar-.css',
	];

	useEffect(() => {
		checkForStyles(i18n.language);

		i18n.on('languageChanged', (lang) => {
			checkForStyles(lang);
		});
	}, []);

	const checkForStyles = (lang) => {
		let head = document.getElementsByTagName('head')[0];

		if (lang == 'ar') {
			for (let style of stylesAr) {
				//Remove last one
				document.getElementById(`style-${stylesAr.indexOf(style)}`) &&
					document.getElementById(`style-${stylesAr.indexOf(style)}`).remove();

				let link = document.createElement('link');
				link.rel = 'stylesheet';
				link.type = 'text/css';
				link.href = style;
				link.media = 'all';
				link.id = `style-${stylesAr.indexOf(style)}`;
				head.appendChild(link);
			}
		} else if (lang == 'en') {
			for (let style of stylesEn) {
				//Remove last one
				document.getElementById(`style-${stylesEn.indexOf(style)}`) &&
					document.getElementById(`style-${stylesEn.indexOf(style)}`).remove();

				let link = document.createElement('link');
				link.rel = 'stylesheet';
				link.type = 'text/css';
				link.href = style;
				link.media = 'all';
				link.id = `style-${stylesEn.indexOf(style)}`;
				head.appendChild(link);
			}
		}
	};
	return (
		<div className="app-container">
			<Router>
				<Switch>
					<Route exact path="/" component={() => <h1>Please open the link we have sent to you</h1>} />
					<Route exact path="/:orderId" component={Tracking} />
				</Switch>
			</Router>
		</div>
	);
};

export default App;
