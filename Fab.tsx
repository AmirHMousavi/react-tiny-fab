import React, { CSSProperties } from "react";

import "./FabStyles.css";

const AB = (p: any) => (
	<button type="button" {...p} className="rtf--ab">
		{p.children}
	</button>
);

export const MB = (p: any) => (
	<button type="button" className="rtf--mb" {...p}>
		{p.children}
	</button>
);

interface Props {
	event: any;
	position: any;
	icon: any;
	mainButtonStyles: any;
	actionButtonStyles?: any;
}

interface State {
	open: boolean;
}

class Fab extends React.Component<Props, State> {
	static defaultProps = {
		position: { bottom: 0, right: 0 },
		event: "hover"
	};

	state = { open: false };

	enter = () => this.props.event === "hover" && this.open();

	leave = () => this.props.event === "hover" && this.close();

	open = () => this.setState({ open: true });

	close = () => this.setState({ open: false });

	toggle = () =>
		this.props.event === "click"
			? this.state.open
				? this.close()
				: this.open()
			: null;

	actionOnClick = (userFunc: any) => {
		this.setState({ open: false }, () => {
			// Hack to allow the FAB to close before the user event fires
			setTimeout(() => {
				userFunc();
			}, 1);
		});
	};

	rc() {
		const { children: c, position: p } = this.props;
		const { open } = this.state;
		if (React.Children.count(c) > 6) {
			console.warn("react-tiny-fab only supports up to 6 action buttons");
		}
		return React.Children.map(c, (ch: any, i) => (
			<li className={`rtf--ab__c ${"top" in p ? "top" : ""}`}>
				{React.cloneElement(ch, {
					"data-testid": `action-button-${i}`,
					"aria-label": ch.props.text || `Menu button ${i + 1}`,
					"aria-hidden": !open,
					...ch.props,
					onClick: () => this.actionOnClick(ch.props.onClick)
				})}
				{ch.props.text && (
					<span className={"right" in p ? "right" : ""} aria-hidden={!open}>
						{ch.props.text}
					</span>
				)}
			</li>
		));
	}

	render() {
		const { position, icon, mainButtonStyles } = this.props;
		return (
			<ul
				onMouseEnter={this.enter}
				onMouseLeave={this.leave}
				className={`rtf ${this.state.open ? "open" : "closed"}`}
				data-testid="fab"
				style={position}
			>
				<li className="rtf--mb__c">
					<MB
						onClick={this.toggle}
						style={mainButtonStyles}
						data-testid="main-button"
						role="button"
						aria-label="Floating menu"
						tabIndex="0"
					>
						{icon}
					</MB>
					<ul>{this.rc()}</ul>
				</li>
			</ul>
		);
	}
}

export { Fab, AB as Action };
export interface Components {
	position: {
		bottom?: number;
		left?: number;
		top?: number;
		right?: number;
	};
	event: string;
	mainButtonStyles: {
		backgroundColor: string;
		color?: string;
	};
	actionButtonStyles: {
		backgroundColor: string;
		color?: string;
	};
}
