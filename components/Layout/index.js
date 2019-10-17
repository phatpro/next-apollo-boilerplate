import React from 'react';
import Link from 'next/link';
import { makeStyles } from '@material-ui/styles';

export default function Layout(props) {
	const classes = useStyles();

	return (
		<React.Fragment>
			{props.children}
			<div>
				<div>Nav</div>
				<div>
					<Link href="/home" as="/">
						<a className={classes.link}>Home</a>
					</Link>
					<Link href="/page-1" as="/trang-1">
						<a className={classes.link}>Page 1</a>
					</Link>
					<Link href="/page-2" as="/trang-2">
						<a className={classes.link}>Page 2</a>
					</Link>
				</div>
			</div>
		</React.Fragment>
	);
}

// styles
const useStyles = makeStyles((theme) => ({
	link: {
		marginRight: '8px',
		textDecoration: 'none',
		fontWeight: 'bold',
		color: '#000'
	}
}));
