import React from 'react';
import initApolloClient from './initApolloClient';
import Head from 'next/head';
import { getDataFromTree } from 'react-apollo';

export default (App) => {
	return class Apollo extends React.Component {
		static displayName = 'withApolloClient(MyApp)';
		static async getInitialProps(appContext) {
			const { Component, router, ctx } = appContext;

			let appProps = {};
			if (App.getInitialProps) {
				appProps = await App.getInitialProps(appContext);
			}

			// Run all GraphQL queries in the component tree
			// and extract the resulting data
			const apollo = initApolloClient();
			if (typeof window === 'undefined') {
				try {
					// Run all GraphQL queries
					await getDataFromTree(
						<App
							{...appProps}
							Component={Component}
							router={router}
							apolloClient={apollo}
						/>
					);
				} catch (error) {
					// Prevent Apollo Client GraphQL errors from crashing SSR.
					// Handle them in components via the data.error prop:
					// https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
					console.error('Error while running `getDataFromTree`', error);

					// Handle error while query
					if (error) {
						const { res } = ctx;
						res.redirect(307, '/');
					}
				}

				// getDataFromTree does not call componentWillUnmount
				// head side effect therefore need to be cleared manually
				Head.rewind();
			}

			// Extract query data from the Apollo store
			const apolloState = apollo.cache.extract();

			return {
				...appProps,
				apolloState
			};
		}

		constructor(props) {
			super(props);
			this.apolloClient = initApolloClient(props.apolloState);
		}

		render() {
			return <App {...this.props} apolloClient={this.apolloClient} />;
		}
	};
};
