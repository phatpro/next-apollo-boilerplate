import React from 'react';
import NextDocument, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/styles';
import flush from 'styled-jsx/server';
import csso from 'csso';

export default class Document extends NextDocument {
	static async getInitialProps(context) {
		// Resolution order
		//
		// On the server:
		// 1. app.getInitialProps
		// 2. page.getInitialProps
		// 3. document.getInitialProps
		// 4. app.render
		// 5. page.render
		// 6. document.render
		//
		// On the server with error:
		// 1. document.getInitialProps
		// 2. app.render
		// 3. page.render
		// 4. document.render
		//
		// On the client
		// 1. app.getInitialProps
		// 2. page.getInitialProps
		// 3. app.render
		// 4. page.render

		// Render app and page and get the context of the page with collected side effects.
		const muiSheets = new ServerStyleSheets();
		const originalRenderPage = context.renderPage;

		try {
			context.renderPage = () =>
				originalRenderPage({
					// useful for wrapping the whole react tree
					enhanceApp: (App) => (props) => muiSheets.collect(<App {...props} />),
					// useful for wrapping in a per-page basis
					enhanceComponent: (Component) => Component
				});

			// Run the parent `getInitialProps` using `ctx` that now includes our custom `renderPage`
			const initialProps = await NextDocument.getInitialProps(context);

			// Get mui style element
			const muiStyleElement = muiSheets.getStyleElement({ id: 'css-server-side' });
			muiStyleElement.props.dangerouslySetInnerHTML.__html = csso.minify(
				`${muiStyleElement.props.dangerouslySetInnerHTML.__html}`,
				{ restructure: false }
			).css;

			return {
				...initialProps,
				// Styles fragment is rendered after the app and page rendering finish.
				styles: (
					<React.Fragment>
						{initialProps.styles}
						{muiStyleElement}
						{flush() || null}
					</React.Fragment>
				)
			};
		} catch (error) {
			console.log(error);
		}
	}

	render = () => (
		<html>
			<Head />
			<body>
				<Main />
				<NextScript />
			</body>
		</html>
	);
}
