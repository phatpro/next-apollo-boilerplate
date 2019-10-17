import React, { Component } from 'react';
import NextApp from 'next/app';

// hocs
import withApolloClient from '../lib/withApolloClient';

// providers
import { ApolloProvider } from 'react-apollo';

// components
import Layout from '../components/Layout';

class App extends NextApp {
	componentDidMount() {
		// Remove the server-side injected CSS.
		const jssStyles = document.getElementById('css-server-side');
		if (jssStyles && jssStyles.parentNode) {
			jssStyles.parentNode.removeChild(jssStyles);
		}
	}

	render() {
		const { Component, pageProps, apolloClient } = this.props;

		return (
			<ApolloProvider client={apolloClient}>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</ApolloProvider>
		);
	}
}

export default withApolloClient(App);
