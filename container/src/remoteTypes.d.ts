///<reference types="react" />

declare module "app1/CounterAppOne" {
	interface CounterAppOneProps {
		id?: number;
	}

	const CounterAppOne: React.ComponentType<CounterAppOneProps>;

	export default CounterAppOne;
}

declare module "app2/CounterAppTwo" {

	interface CounterAppTwoProps {
		search?: string;
		setSearch?:(value:string)=>void;
	}

	const CounterAppTwo: React.ComponentType<CounterAppTwoProps>;

	export default CounterAppTwo;
}
