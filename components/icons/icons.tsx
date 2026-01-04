import React from 'react';
import type { SVGProps } from 'react';
import Image from "next/image";
import tellerLogo from "@/public/banks/logos/tellerLogo.png"; // adjust the path as needed
import { useCursorVector } from '@/lib/hooks/useCursorVector';


export function MageDashboard(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.557 2.75H4.682A1.93 1.93 0 0 0 2.75 4.682v3.875a1.94 1.94 0 0 0 1.932 1.942h3.875a1.94 1.94 0 0 0 1.942-1.942V4.682A1.94 1.94 0 0 0 8.557 2.75m10.761 0h-3.875a1.94 1.94 0 0 0-1.942 1.932v3.875a1.943 1.943 0 0 0 1.942 1.942h3.875a1.94 1.94 0 0 0 1.932-1.942V4.682a1.93 1.93 0 0 0-1.932-1.932m0 10.75h-3.875a1.94 1.94 0 0 0-1.942 1.933v3.875a1.94 1.94 0 0 0 1.942 1.942h3.875a1.94 1.94 0 0 0 1.932-1.942v-3.875a1.93 1.93 0 0 0-1.932-1.932M8.557 13.5H4.682a1.943 1.943 0 0 0-1.932 1.943v3.875a1.93 1.93 0 0 0 1.932 1.932h3.875a1.94 1.94 0 0 0 1.942-1.932v-3.875a1.94 1.94 0 0 0-1.942-1.942"></path></svg>);
}


export function SolarPieChartBold(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" fillRule="evenodd" d="M9.163 3.775a.75.75 0 0 1-.49.94A8.465 8.465 0 0 0 2.75 12.79a8.46 8.46 0 0 0 8.46 8.461a8.465 8.465 0 0 0 8.075-5.922a.75.75 0 1 1 1.43.45c-1.268 4.04-5.043 6.972-9.504 6.972c-5.501 0-9.961-4.46-9.961-9.96c0-4.462 2.932-8.236 6.973-9.506a.75.75 0 0 1 .94.491" clipRule="evenodd"></path><path fill="currentColor" d="M21.913 9.947a11.35 11.35 0 0 0-7.86-7.86C12.409 1.628 11 3.054 11 4.76v6.694c0 .853.692 1.545 1.545 1.545h6.694c1.707 0 3.133-1.41 2.674-3.053"></path></svg>);
}


export function SolarWalletBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M5.75 7a.75.75 0 0 0 0 1.5h4a.75.75 0 0 0 0-1.5z"></path><path fill="currentColor" fillRule="evenodd" d="M21.188 8.004q-.094-.005-.2-.004h-2.773C15.944 8 14 9.736 14 12s1.944 4 4.215 4h2.773q.106.001.2-.004c.923-.056 1.739-.757 1.808-1.737c.004-.064.004-.133.004-.197V9.938c0-.064 0-.133-.004-.197c-.069-.98-.885-1.68-1.808-1.737m-3.217 5.063c.584 0 1.058-.478 1.058-1.067c0-.59-.474-1.067-1.058-1.067s-1.06.478-1.06 1.067c0 .59.475 1.067 1.06 1.067" clipRule="evenodd"></path><path fill="currentColor" d="M21.14 8.002c0-1.181-.044-2.448-.798-3.355a4 4 0 0 0-.233-.256c-.749-.748-1.698-1.08-2.87-1.238C16.099 3 14.644 3 12.806 3h-2.112C8.856 3 7.4 3 6.26 3.153c-1.172.158-2.121.49-2.87 1.238c-.748.749-1.08 1.698-1.238 2.87C2 8.401 2 9.856 2 11.694v.112c0 1.838 0 3.294.153 4.433c.158 1.172.49 2.121 1.238 2.87c.749.748 1.698 1.08 2.87 1.238c1.14.153 2.595.153 4.433.153h2.112c1.838 0 3.294 0 4.433-.153c1.172-.158 2.121-.49 2.87-1.238q.305-.308.526-.66c.45-.72.504-1.602.504-2.45l-.15.001h-2.774C15.944 16 14 14.264 14 12s1.944-4 4.215-4h2.773q.079 0 .151.002" opacity={0.5}></path></svg>);
}


export function MynauiSidebar(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3.5v17M3 9.4c0-2.24 0-3.36.436-4.216a4 4 0 0 1 1.748-1.748C6.04 3 7.16 3 9.4 3h5.2c2.24 0 3.36 0 4.216.436a4 4 0 0 1 1.748 1.748C21 6.04 21 7.16 21 9.4v5.2c0 2.24 0 3.36-.436 4.216a4 4 0 0 1-1.748 1.748C17.96 21 16.84 21 14.6 21H9.4c-2.24 0-3.36 0-4.216-.436a4 4 0 0 1-1.748-1.748C3 17.96 3 16.84 3 14.6z"></path></svg>);
}


export function MynauiSidebarAlt(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 3.5v17M3 9.4c0-2.24 0-3.36.436-4.216a4 4 0 0 1 1.748-1.748C6.04 3 7.16 3 9.4 3h5.2c2.24 0 3.36 0 4.216.436a4 4 0 0 1 1.748 1.748C21 6.04 21 7.16 21 9.4v5.2c0 2.24 0 3.36-.436 4.216a4 4 0 0 1-1.748 1.748C17.96 21 16.84 21 14.6 21H9.4c-2.24 0-3.36 0-4.216-.436a4 4 0 0 1-1.748-1.748C3 17.96 3 16.84 3 14.6z"></path></svg>);
}


export function HugeiconsHome04(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={props.stroke} d="M3 11.99v2.51c0 3.3 0 4.95 1.025 5.975S6.7 21.5 10 21.5h4c3.3 0 4.95 0 5.975-1.025S21 17.8 21 14.5v-2.51c0-1.682 0-2.522-.356-3.25s-1.02-1.244-2.346-2.276l-2-1.555C14.233 3.303 13.2 2.5 12 2.5s-2.233.803-4.298 2.409l-2 1.555C4.375 7.496 3.712 8.012 3.356 8.74S3 10.308 3 11.99M16 17H8"></path></svg>);
}


export function HugeiconsPieChart09(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={props.stroke} d="M16.556 4.619a10 10 0 0 0-2.6-1.259c-1.158-.364-1.736-.545-2.346-.088C11 3.728 11 4.47 11 5.954v4.551c0 1.264 0 1.895.234 2.462c.234.566.678 1.008 1.566 1.892l3.199 3.187c1.043 1.038 1.565 1.558 2.313 1.435c.748-.122 1.025-.67 1.58-1.764a10.3 10.3 0 0 0 .348-8.54a10.13 10.13 0 0 0-3.684-4.56M14 20.419A8 8 0 1 1 8.21 5.5"></path></svg>);
}


export function StreamlineUltimateTradingPatternUp(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} strokeWidth={1.5} d="M4.25 9.15c0 .6-.4 1-1 1h-1.5c-.6 0-1-.4-1-1v-3c0-.6.4-1 1-1h1.5c.6 0 1 .4 1 1zm-1.75-4V.75m0 9.4v3m7.25 5.1c0 .6-.4 1-1 1h-1.5c-.6 0-1-.4-1-1v-4.5c0-.6.4-1 1-1h1.5c.6 0 1 .4 1 1zM8 12.75v-3m0 9.5v4m8.55-6.4c0 .6-.4 1-1 1h-1.5c-.6 0-1-.4-1-1v-4c0-.6.4-1 1-1h1.5c.6 0 1 .4 1 1zm-1.75 1v4m2.45-15l3-3.6l3 3.6m-3-3.6v15.6"></path></svg>);
}


export function SolarWallet2Outline(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" strokeWidth={props.stroke} d="M19 12a1 1 0 1 1-2 0a1 1 0 0 1 2 0"></path><path fill="currentColor" fillRule="evenodd" d="M9.944 3.25h3.112c1.838 0 3.294 0 4.433.153c1.172.158 2.121.49 2.87 1.238c.924.925 1.219 2.163 1.326 3.77c.577.253 1.013.79 1.06 1.47c.005.061.005.126.005.186v3.866c0 .06 0 .125-.004.185c-.048.68-.484 1.218-1.061 1.472c-.107 1.606-.402 2.844-1.326 3.769c-.749.748-1.698 1.08-2.87 1.238c-1.14.153-2.595.153-4.433.153H9.944c-1.838 0-3.294 0-4.433-.153c-1.172-.158-2.121-.49-2.87-1.238c-.748-.749-1.08-1.698-1.238-2.87c-.153-1.14-.153-2.595-.153-4.433v-.112c0-1.838 0-3.294.153-4.433c.158-1.172.49-2.121 1.238-2.87c.749-.748 1.698-1.08 2.87-1.238c1.14-.153 2.595-.153 4.433-.153m10.224 12.5H18.23c-2.145 0-3.981-1.628-3.981-3.75s1.836-3.75 3.98-3.75h1.938c-.114-1.341-.371-2.05-.87-2.548c-.423-.423-1.003-.677-2.009-.812c-1.027-.138-2.382-.14-4.289-.14h-3c-1.907 0-3.261.002-4.29.14c-1.005.135-1.585.389-2.008.812S3.025 6.705 2.89 7.71c-.138 1.028-.14 2.382-.14 4.289s.002 3.262.14 4.29c.135 1.005.389 1.585.812 2.008s1.003.677 2.009.812c1.028.138 2.382.14 4.289.14h3c1.907 0 3.262-.002 4.29-.14c1.005-.135 1.585-.389 2.008-.812c.499-.498.756-1.206.87-2.548m.756-6H18.23c-1.424 0-2.481 1.059-2.481 2.25s1.057 2.25 2.48 2.25h2.718c.206-.013.295-.152.302-.236V9.986c-.007-.084-.096-.223-.302-.235zM7 8.25a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0V9A.75.75 0 0 1 7 8.25" clipRule="evenodd"></path></svg>);
}



export function HugeiconsTransactionHistory(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={props.stroke}><path d="M19 10.5V10c0-3.771 0-5.657-1.172-6.828S14.771 2 11 2S5.343 2 4.172 3.172S3 6.229 3 10v4.5c0 3.287 0 4.931.908 6.038q.25.304.554.554C5.57 22 7.212 22 10.5 22M7 7h8m-8 4h4"></path><path d="m18 18.5l-1.5-.55V15.5m-4.5 2a4.5 4.5 0 1 0 9 0a4.5 4.5 0 0 0-9 0"></path></g></svg>);
}


export function HugeiconsAnalyticsUp(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}><path d="M7 18v-2m5 2v-3m5 3v-5M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12"></path><path d="M5.992 11.486c2.155.072 7.042-.253 9.822-4.665m-1.822-.533l1.876-.302c.228-.029.564.152.647.367l.495 1.638"></path></g></svg>);
}


export function MageGoals(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={props.stroke || 1.8}><path d="M10.66 10.66A1.9 1.9 0 0 0 10.1 12a1.9 1.9 0 0 0 1.9 1.9a1.9 1.9 0 0 0 1.34-.56"></path><path d="M12 6.3a5.7 5.7 0 1 0 5.7 5.7"></path><path d="M12 2.5a9.5 9.5 0 1 0 9.5 9.5m-5.975-3.524L12.95 11.05"></path><path d="M20.94 5.844L17.7 6.3l.456-3.24a.19.19 0 0 0-.313-.161l-2.148 2.137a1.9 1.9 0 0 0-.513 1.72l.342 1.72l1.72.341a1.9 1.9 0 0 0 1.72-.513L21.1 6.157a.19.19 0 0 0-.162-.313"></path></g></svg>);
}


export function StreamlinePlumpFileReport(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 48 48" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3}><path d="M29.368 3.08c.897.28 3.777 1.422 7.937 5.479c3.92 3.823 5.187 6.538 5.559 7.57C42.947 18.37 43 20.98 43 24c0 8.065-.375 13.204-.717 16.214c-.25 2.202-1.903 3.848-4.103 4.105c-2.815.329-7.413.681-14.18.681s-11.365-.352-14.18-.68c-2.2-.258-3.853-1.904-4.103-4.106C5.375 37.204 5 32.064 5 24s.375-13.204.717-16.214C5.967 5.584 7.62 3.938 9.82 3.68C12.635 3.353 17.233 3 24 3c1.97 0 3.756.03 5.368.08M13 37h22m-22-7h22"></path><path d="M13 22.868c2.572-3.93 4.717-5.656 5.896-6.38c.557-.343 1.23-.119 1.52.468c.663 1.345 1.29 3.193 1.737 4.66c.264.86 1.52 1.045 2.073.335C26.452 19.095 29.5 16.5 29.5 16.5m4.067 1.82c.44-2.324.457-4.363.42-5.443a.89.89 0 0 0-.864-.865a25.5 25.5 0 0 0-5.444.42c-.754.143-1.004 1.062-.46 1.605l4.744 4.745c.543.543 1.461.293 1.604-.461"></path></g></svg>);
}


export function HugeiconsAnalytics02(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeWidth={props.stroke}><path strokeLinecap="round" d="M6.5 17.5v-3m5 3v-9m5 9v-4"></path><path d="M21.5 5.5a3 3 0 1 1-6 0a3 3 0 0 1 6 0Z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M21.496 11s.004.34.004 1c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12c0-4.478 0-6.717 1.391-8.109C5.282 2.5 7.521 2.5 12 2.5h1"></path></g></svg>);
}


export function TablerLayoutSidebarLeftExpand(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm5-2v16"></path><path d="m14 10l2 2l-2 2"></path></g></svg>);
}


export function HugeiconsSidebarLeft01(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth={1.5}><path d="M2 12c0-3.75 0-5.625.955-6.939A5 5 0 0 1 4.06 3.955C5.375 3 7.251 3 11 3h2c3.75 0 5.625 0 6.939.955a5 5 0 0 1 1.106 1.106C22 6.375 22 8.251 22 12s0 5.625-.955 6.939a5 5 0 0 1-1.106 1.106C18.625 21 16.749 21 13 21h-2c-3.75 0-5.625 0-6.939-.955a5 5 0 0 1-1.106-1.106C2 17.625 2 15.749 2 12Zm7.5-8.5v17"></path><path strokeLinecap="round" d="M5 7h1.5M5 11h1.5M17 10l-1.226 1.057c-.516.445-.774.667-.774.943s.258.498.774.943L17 14"></path></g></svg>);
}


export function FluentPanelLeftExpand16Filled(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" {...props}><g fill="currentColor"><path d="M8.5 7.5h1.791l-.646-.646a.5.5 0 0 1 .707-.707l1.5 1.5a.5.5 0 0 1 0 .707l-1.5 1.5a.5.5 0 1 1-.707-.707l.646-.647H8.5a.5.5 0 0 1 0-1"></path><path d="M2 4.999a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6.002a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm10-1H7v8.002h5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1"></path></g></svg>);
}


export function FluentPanelLeftExpand28Filled(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 28 28" {...props}><path fill="currentColor" d="M17.72 11.53a.75.75 0 1 1 1.06-1.06l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72h-5.69a.75.75 0 0 1 0-1.5h5.69zM22.25 4A3.75 3.75 0 0 1 26 7.75v12.5A3.75 3.75 0 0 1 22.25 24H5.755a3.75 3.75 0 0 1-3.75-3.75V7.75A3.75 3.75 0 0 1 5.754 4zm2.25 3.75a2.25 2.25 0 0 0-2.25-2.25H11.006v17H22.25a2.25 2.25 0 0 0 2.25-2.25z"></path></svg>);
}


export function TablerEyeDollar(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0-4 0"></path><path d="M13.193 17.924q-.585.075-1.193.076q-5.4 0-9-6q3.6-6 9-6q4.508 0 7.761 4.181M21 15h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3H17m2 0v1m0-8v1"></path></g></svg>);
}


export function SolarCard2Outline(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" fillRule="evenodd" d="M9.944 3.25h4.112c1.838 0 3.294 0 4.433.153c1.172.158 2.121.49 2.87 1.238c.748.749 1.08 1.698 1.238 2.87c.09.673.127 1.456.142 2.363a.8.8 0 0 1 .004.23q.009.848.007 1.84v.112c0 1.838 0 3.294-.153 4.433c-.158 1.172-.49 2.121-1.238 2.87c-.749.748-1.698 1.08-2.87 1.238c-1.14.153-2.595.153-4.433.153H9.944c-1.838 0-3.294 0-4.433-.153c-1.172-.158-2.121-.49-2.87-1.238c-.748-.749-1.08-1.698-1.238-2.87c-.153-1.14-.153-2.595-.153-4.433v-.112q-.002-.992.007-1.84a.8.8 0 0 1 .003-.23c.016-.907.053-1.69.143-2.363c.158-1.172.49-2.121 1.238-2.87c.749-.748 1.698-1.08 2.87-1.238c1.14-.153 2.595-.153 4.433-.153m-7.192 7.5q-.002.582-.002 1.25c0 1.907.002 3.262.14 4.29c.135 1.005.389 1.585.812 2.008s1.003.677 2.009.812c1.028.138 2.382.14 4.289.14h4c1.907 0 3.262-.002 4.29-.14c1.005-.135 1.585-.389 2.008-.812s.677-1.003.812-2.009c.138-1.028.14-2.382.14-4.289q0-.668-.002-1.25zm18.472-1.5H2.776c.02-.587.054-1.094.114-1.54c.135-1.005.389-1.585.812-2.008s1.003-.677 2.009-.812c1.028-.138 2.382-.14 4.289-.14h4c1.907 0 3.262.002 4.29.14c1.005.135 1.585.389 2.008.812s.677 1.003.812 2.009c.06.445.094.952.114 1.539m-5.269 3h.09c.433 0 .83 0 1.152.043c.356.048.731.16 1.04.47s.422.684.47 1.04c.043.323.043.72.043 1.152v.09c0 .433 0 .83-.043 1.152c-.048.356-.16.731-.47 1.04s-.684.422-1.04.47c-.323.043-.72.043-1.152.043h-.09c-.433 0-.83 0-1.152-.043c-.356-.048-.731-.16-1.04-.47s-.422-.684-.47-1.04c-.043-.323-.043-.72-.043-1.152v-.09c0-.433 0-.83.043-1.152c.048-.356.16-.731.47-1.04s.684-.422 1.04-.47c.323-.043.72-.043 1.152-.043m-1.13 1.572l-.002.001l-.001.003l-.005.01a.7.7 0 0 0-.037.167c-.028.21-.03.504-.03.997s.002.787.03.997a.7.7 0 0 0 .042.177l.001.003l.003.001l.01.005c.022.009.07.024.167.037c.21.028.504.03.997.03s.787-.002.997-.03a.7.7 0 0 0 .177-.042l.003-.001l.001-.003l.005-.01a.7.7 0 0 0 .037-.167c.028-.21.03-.504.03-.997s-.002-.787-.03-.997a.7.7 0 0 0-.042-.177l-.001-.003l-.003-.001l-.01-.005a.7.7 0 0 0-.167-.037c-.21-.028-.504-.03-.997-.03s-.787.002-.997.03a.7.7 0 0 0-.177.042M5.25 13.5a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75m0 3a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75" clipRule="evenodd"></path></svg>);
}


export function GuidanceBank(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" d="M21.5 9v10M5.5 9v10m-3-10v10m16-10v10M2 21h20M0 23.5h24M12 11h-1a1 1 0 0 0-1 1v.375a1 1 0 0 0 .72.96l2.56.747a1 1 0 0 1 .72.96V16a1 1 0 0 1-1 1h-1m0-6h1a1 1 0 0 1 1 1v.5M12 11V9m0 8h-1a1 1 0 0 1-1-1v-.5m2 1.5v2M23.5 6.25V7H.5v-.75C5.5 4.5 8.5 3 11.75.5h.5C15.5 3 18.5 4.5 23.5 6.25Z" strokeWidth={1.3}></path></svg>);
}


export function LetsIconsDoneDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none"><circle cx={12} cy={12} r={8} fill="currentColor" fillOpacity={0.25}></circle><path stroke="currentColor" strokeWidth={1.2} d="m8.5 11l2.894 2.894a.15.15 0 0 0 .212 0L19.5 6"></path></g></svg>);
}


export function StreamlineFlexWallet(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={10} height={10} viewBox="0 0 14 14" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.3}><path d="M12.33 6.657a16 16 0 0 0-.193-1.163c-.184-.976-1.021-1.761-2.073-1.91l-.037-.005l-.02-.138c1.089-.49.807-2.013-.254-2.234c-.869-.18-2.885-.25-4.09-.25c-1.144 0-1.909.16-2.727.33q-.066.016-.133.028c-.875.183-1.572 1.143-1.726 2.34l-.009.068a21.6 21.6 0 0 0-.217 3.205q0 .381.008.709q-.008.245-.008.53c0 1.235.123 1.887.261 2.618l.01.055c.185.977 1.023 1.761 2.074 1.91l.16.023c.982.14 1.9.27 3.274.27s2.292-.13 3.274-.27l.16-.023c1.052-.149 1.89-.933 2.073-1.91l.011-.055c.066-.35.129-.68.176-1.067"></path><path d="M4.391 3.57c.686-.052 1.819-.175 2.997-.175c1.22 0 1.797.062 2.597.174m2.357 6.151h-1.566a1.531 1.531 0 0 1 0-3.063h1.566a1 1 0 0 1 1 1V8.72a1 1 0 0 1-1 1"></path></g></svg>);
}

export function FluentDelete28Regular(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 28 28" {...props}><path fill="currentColor" d="M11.5 6h5a2.5 2.5 0 0 0-5 0M10 6a4 4 0 0 1 8 0h6.25a.75.75 0 0 1 0 1.5h-1.31l-1.217 14.603A4.25 4.25 0 0 1 17.488 26h-6.976a4.25 4.25 0 0 1-4.235-3.897L5.06 7.5H3.75a.75.75 0 0 1 0-1.5zM7.772 21.978a2.75 2.75 0 0 0 2.74 2.522h6.976a2.75 2.75 0 0 0 2.74-2.522L21.436 7.5H6.565zM11.75 11a.75.75 0 0 1 .75.75v8.5a.75.75 0 0 1-1.5 0v-8.5a.75.75 0 0 1 .75-.75m5.25.75a.75.75 0 0 0-1.5 0v8.5a.75.75 0 0 0 1.5 0z"></path></svg>);
}

export function SolarTrashBinMinimalisticBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M3 6.524c0-.395.327-.714.73-.714h4.788c.006-.842.098-1.995.932-2.793A3.68 3.68 0 0 1 12 2a3.68 3.68 0 0 1 2.55 1.017c.834.798.926 1.951.932 2.793h4.788c.403 0 .73.32.73.714a.72.72 0 0 1-.73.714H3.73A.72.72 0 0 1 3 6.524"></path><path fill="currentColor" d="M11.596 22h.808c2.783 0 4.174 0 5.08-.886c.904-.886.996-2.339 1.181-5.245l.267-4.188c.1-1.577.15-2.366-.303-2.865c-.454-.5-1.22-.5-2.753-.5H8.124c-1.533 0-2.3 0-2.753.5s-.404 1.288-.303 2.865l.267 4.188c.185 2.906.277 4.36 1.182 5.245c.905.886 2.296.886 5.079.886" opacity={0.5}></path><path fill="currentColor" fillRule="evenodd" d="M9.425 11.482c.413-.044.78.273.821.707l.5 5.263c.041.433-.26.82-.671.864c-.412.043-.78-.273-.821-.707l-.5-5.263c-.041-.434.26-.821.671-.864m5.15 0c.412.043.713.43.671.864l-.5 5.263c-.04.434-.408.75-.82.707c-.413-.044-.713-.43-.672-.864l.5-5.264c.041-.433.409-.75.82-.707" clipRule="evenodd"></path></svg>);
}


export function ProiconsFolderAdd(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none"><path fill="currentColor" fillRule="evenodd" d="M17.5 23a5.5 5.5 0 1 0 0-11a5.5 5.5 0 0 0 0 11m0-8.993a.5.5 0 0 1 .5.5V17h2.493a.5.5 0 1 1 0 1H18v2.494a.5.5 0 0 1-1 0V18h-2.493a.5.5 0 1 1 0-1H17v-2.493a.5.5 0 0 1 .5-.5" clipRule="evenodd"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.75 8.623v7.379a4 4 0 0 0 4 4h3.35M2.75 8.623V6.998a3 3 0 0 1 3-3h2.9a2.5 2.5 0 0 1 1.768.732L12 6.313m-9.25 2.31h5.904a2.5 2.5 0 0 0 1.768-.732L12 6.313m0 0l5.25-.002a4 4 0 0 1 4 4v.669"></path></g></svg>);
}


export function StreamlineFlexWalletAdd(props: SVGProps<SVGSVGElement>) {
	return (
	  <svg
		xmlns="http://www.w3.org/2000/svg"
		width={14}
		height={14}
		viewBox="0 0 14 14"
		{...props}
	  >
		<g
		  fill="none"
		  stroke="currentColor"
		  strokeLinecap="round"
		  strokeLinejoin="round"
		  strokeWidth={1.3}
		>
		  {/* Wallet */}
		  <path d="M12.33 6.657a16 16 0 0 0-.193-1.163c-.184-.976-1.021-1.761-2.073-1.91l-.037-.005l-.02-.138c1.089-.49.807-2.013-.254-2.234c-.869-.18-2.885-.25-4.09-.25c-1.144 0-1.909.16-2.727.33q-.066.016-.133.028c-.875.183-1.572 1.143-1.726 2.34l-.009.068a21.6 21.6 0 0 0-.217 3.205q0 .381.008.709q-.008.245-.008.53c0 1.235.123 1.887.261 2.618l.01.055c.185.977 1.023 1.761 2.074 1.91l.16.023c.982.14 1.9.27 3.274.27s2.292-.13 3.274-.27l.16-.023c1.052-.149 1.89-.933 2.073-1.91l.011-.055c.066-.35.129-.68.176-1.067"></path>
		  <path d="M4.391 3.57c.686-.052 1.819-.175 2.997-.175c1.22 0 1.797.062 2.597.174m2.357 6.151h-1.566a1.531 1.531 0 0 1 0-3.063h1.566a1 1 0 0 1 1 1V8.72a1 1 0 0 1-1 1"></path>
  
		  {/* Plus Icon (bottom-left) */}
		  <g transform="translate(1, 10)">
			<circle cx="2" cy="2" r="2.2" stroke="currentColor" />
			<path d="M2 0.8v2.4M0.8 2h2.4" />
		  </g>
		</g>
	  </svg>
	);
  }


export function StreamlineFlexHome2(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 14 14" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.3}><path d="M3.837 12.797h6.326c.67 0 1.24-.489 1.341-1.15c.162-1.052.2-2.118.112-3.177h1.224a.5.5 0 0 0 .422-.768l-.212-.333a20 20 0 0 0-4.785-5.205l-.66-.5a1 1 0 0 0-1.21 0l-.66.5A20 20 0 0 0 .95 7.37l-.212.333a.5.5 0 0 0 .422.768h1.224a13.6 13.6 0 0 0 .112 3.176c.102.662.671 1.15 1.34 1.15"></path><path d="M7 8.089c.921 0 1.668.746 1.668 1.667v3.04H5.333v-3.04c0-.92.746-1.667 1.667-1.667"></path></g></svg>);
}


export function LetsIconsAddRingDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none"><circle cx={12} cy={12} r={9} fill="currentColor" fillOpacity={0.25}></circle><path stroke="currentColor" strokeLinecap="square" strokeWidth={1.2} d="M12 15V9m3 3H9"></path></g></svg>);
}


export function SolarAddSquareBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12 22c-4.714 0-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22" opacity={0.5}></path><path fill="currentColor" d="M12 8.25a.75.75 0 0 1 .75.75v2.25H15a.75.75 0 0 1 0 1.5h-2.25V15a.75.75 0 0 1-1.5 0v-2.25H9a.75.75 0 0 1 0-1.5h2.25V9a.75.75 0 0 1 .75-.75"></path></svg>);
}


export function StreamlineFlexBellNotification(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 14 14" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M5.677 12.458a1.5 1.5 0 0 0 2.646 0M4.262 1.884a3.872 3.872 0 0 1 6.61 2.738c0 .604.1 1.171.25 1.752q.063.198.137.373c.232.545.871.732 1.348 1.084c.711.527.574 1.654-.018 2.092c0 0-.955.827-5.589.827s-5.589-.827-5.589-.827c-.592-.438-.73-1.565-.018-2.092c.477-.352 1.116-.539 1.348-1.084c.231-.544.387-1.24.387-2.125c0-1.027.408-2.012 1.134-2.738" strokeWidth={1.3}></path></svg>);
}


export function StreamlineFlexLabelFolderTag(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 14 14" {...props}><g fill="none" stroke="currentColor" strokeWidth={1.3}><path strokeLinecap="round" strokeLinejoin="round" d="M5.088 12.46q-1.139-.056-2.284-.18c-.978-.106-1.796-.832-1.915-1.83c-.352-2.944-.24-5.89.097-8.827c.056-.48.439-.86.92-.893A27 27 0 0 1 5.362.697a.99.99 0 0 1 .883.648l.2.541a1 1 0 0 0 .915.651c1.652.035 2.587.042 3.931.153c.946.078 1.69.84 1.745 1.788q.021.353.036.692"></path><path d="M10.53 13.053a1.16 1.16 0 0 1-1.482.043a10 10 0 0 1-.909-.781a10 10 0 0 1-.781-.91a1.16 1.16 0 0 1 .042-1.48c.8-.884 1.635-1.7 2.543-2.49c.168-.147.376-.24.599-.26c.656-.059 2.067-.133 2.469.268c.401.402.327 1.813.268 2.469c-.02.222-.113.43-.26.599a30 30 0 0 1-2.49 2.543Z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M11.283 9.347a.25.25 0 1 1 0-.5m0 0a.25.25 0 1 1 0 .5"></path></g></svg>);
}



export function StreamlineFlexPieChart(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 14 14" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.3}><path d="M7 5.901V.75C11 .75 13.25 3 13.25 7c0 1.372-.265 2.538-.774 3.479l-4.548-2.89A2 2 0 0 1 7 5.901"></path><path d="M7 13.25c4 0 6.25-2.25 6.25-6.25S11 .75 7 .75S.75 3 .75 7S3 13.25 7 13.25"></path></g></svg>);
}


export default function StreamlineUltimateAccountingCoins(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}><path d="M8.25 8.25a7.5 7.5 0 1 0 15 0a7.5 7.5 0 0 0-15 0m-1.875 5.842a1.34 1.34 0 0 0 .843 1.245l2.064.826a1.342 1.342 0 0 1-.5 2.587H6.75m1.5 1.5v-1.5"></path><path d="M5.281 8.867a7.5 7.5 0 1 0 9.853 9.852M17.25 5.25h-2.033a1.342 1.342 0 0 0-.5 2.587l2.064.826a1.342 1.342 0 0 1-.5 2.587H14.25m1.5-6v-1.5m0 9v-1.5"></path></g></svg>);
}

export  function AIMAPPR(props: SVGProps<SVGSVGElement>) {
	return (<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108.89 108.89">
		<defs>
		  
		</defs>
		<g id="Layer_1-2" data-name="Layer 1">
		  <g>
			<polygon className="clss-1" stroke='1px' fill='#0c64c4' points="108.57 62.77 91.29 47.54 91.29 63.63 47.44 63.63 47.44 88.82 108.89 88.82 108.89 62.77 108.57 62.77"/>
			<polygon className="clss-1" stroke='1px' fill='#0c64c4' points="63.63 61.45 88.82 61.45 88.82 0 62.77 0 62.77 .32 47.54 17.61 63.63 17.61 63.63 61.45"/>
			<polygon className="clss-1" stroke='1px' fill='#0c64c4' points="61.45 20.07 0 20.07 0 46.13 .32 46.13 17.61 61.36 17.61 45.26 61.45 45.26 61.45 20.07"/>
			<polygon className="fill" stroke='1px' fill='#0c64c4' points="45.26 47.44 20.07 47.44 20.07 108.89 46.13 108.89 46.13 108.57 61.36 91.29 45.26 91.29 45.26 47.44"/>
		  </g>
		</g>
	  </svg>);
}

export function PhBrainDuotone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      {...props}
      className={props.className}
    >
      <defs>
        {/* Shimmer gradient */}
        <linearGradient id="shimmerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="50%" stopColor="gray" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            from="-1 0"
            to="1 0"
            dur="3s"
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>

      <g fill="url(#shimmerGradient)">
        <path
          d="M240 124a48 48 0 0 1-32 45.27V176a40 40 0 0 1-80 0a40 40 0 0 1-80 0v-6.73a48 48 0 0 1 0-90.54V72a40 40 0 0 1 80 0a40 40 0 0 1 80 0v6.73A48 48 0 0 1 240 124"
          opacity={0.2}
        />
        <path d="M248 124a56.11 56.11 0 0 0-32-50.61V72a48 48 0 0 0-88-26.49A48 48 0 0 0 40 72v1.39a56 56 0 0 0 0 101.2V176a48 48 0 0 0 88 26.49A48 48 0 0 0 216 176v-1.41A56.09 56.09 0 0 0 248 124M88 208a32 32 0 0 1-31.81-28.56A56 56 0 0 0 64 180h8a8 8 0 0 0 0-16h-8a40 40 0 0 1-13.33-77.73A8 8 0 0 0 56 78.73V72a32 32 0 0 1 64 0v68.26A47.8 47.8 0 0 0 88 128a8 8 0 0 0 0 16a32 32 0 0 1 0 64m104-44h-8a8 8 0 0 0 0 16h8a56 56 0 0 0 7.81-.56A32 32 0 1 1 168 144a8 8 0 0 0 0-16a47.8 47.8 0 0 0-32 12.26V72a32 32 0 0 1 64 0v6.73a8 8 0 0 0 5.33 7.54A40 40 0 0 1 192 164m16-52a8 8 0 0 1-8 8h-4a36 36 0 0 1-36-36v-4a8 8 0 0 1 16 0v4a20 20 0 0 0 20 20h4a8 8 0 0 1 8 8m-148 8h-4a8 8 0 0 1 0-16h4a20 20 0 0 0 20-20v-4a8 8 0 0 1 16 0v4a36 36 0 0 1-36 36" />
      </g>
    </svg>
  );
}


export function MageCaretUpFill(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M19.66 16.01a1.35 1.35 0 0 1-.47.54c-.203.13-.439.2-.68.2h-13a1.3 1.3 0 0 1-.69-.2a1.28 1.28 0 0 1-.56-1.25a1.27 1.27 0 0 1 .31-.65l6.09-6.77a1.7 1.7 0 0 1 .58-.45a1.8 1.8 0 0 1 .73-.18c.253.003.503.05.74.14c.23.101.438.247.61.43l6.11 6.83c.163.182.267.408.3.65a1.24 1.24 0 0 1-.07.71"></path></svg>);
}

export function MageCaretDownFill(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M19.696 8.72a1.2 1.2 0 0 1-.3.64l-6.09 6.76a1.85 1.85 0 0 1-.58.46a1.7 1.7 0 0 1-1.42.03a1.75 1.75 0 0 1-.62-.42l-6.1-6.83a1.3 1.3 0 0 1-.31-.64a1.31 1.31 0 0 1 .56-1.26a1.36 1.36 0 0 1 .68-.21h13a1.29 1.29 0 0 1 1.15.76c.081.228.092.476.03.71"></path></svg>);
}


export function StreamlineFlexFilter2(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 14 14" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M11.552 1.31a43 43 0 0 0-9.104.001C1.184 1.443.388 2.731.99 3.851c.967 1.802 2.347 3.473 4.282 4.73v3.432a1 1 0 0 0 1.399.917l1.455-.632a1 1 0 0 0 .602-.917v-2.8c1.935-1.257 3.315-2.928 4.283-4.73c.6-1.12-.305-2.42-1.46-2.54" strokeWidth={1.3}></path></svg>);
}


export function BasilAppsSolid(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M6.206 2.632a11 11 0 0 0-2.412 0A1.31 1.31 0 0 0 2.64 3.776a10.5 10.5 0 0 0 0 2.448c.07.606.556 1.077 1.154 1.144c.795.09 1.617.09 2.412 0A1.31 1.31 0 0 0 7.36 6.224a10.6 10.6 0 0 0 0-2.448a1.31 1.31 0 0 0-1.154-1.144m7 0a11 11 0 0 0-2.411 0A1.31 1.31 0 0 0 9.64 3.776a10.5 10.5 0 0 0 0 2.448c.07.606.556 1.077 1.154 1.144c.795.09 1.617.09 2.412 0a1.31 1.31 0 0 0 1.154-1.144a10.6 10.6 0 0 0 0-2.448a1.31 1.31 0 0 0-1.154-1.144m7 0a11 11 0 0 0-2.411 0a1.31 1.31 0 0 0-1.155 1.144a10.5 10.5 0 0 0 0 2.448c.07.606.556 1.077 1.154 1.144c.795.09 1.617.09 2.412 0a1.31 1.31 0 0 0 1.154-1.144a10.6 10.6 0 0 0 0-2.448a1.31 1.31 0 0 0-1.154-1.144m-14 7a11 11 0 0 0-2.412 0a1.31 1.31 0 0 0-1.154 1.144a10.5 10.5 0 0 0 0 2.448c.07.606.556 1.077 1.154 1.144c.795.09 1.617.09 2.412 0a1.31 1.31 0 0 0 1.154-1.144a10.6 10.6 0 0 0 0-2.448a1.31 1.31 0 0 0-1.154-1.144m7 0a11 11 0 0 0-2.411 0a1.31 1.31 0 0 0-1.155 1.144a10.5 10.5 0 0 0 0 2.448c.07.606.556 1.077 1.154 1.144c.795.09 1.617.09 2.412 0a1.31 1.31 0 0 0 1.154-1.144a10.5 10.5 0 0 0 0-2.448a1.31 1.31 0 0 0-1.154-1.144m7 0a11 11 0 0 0-2.411 0a1.31 1.31 0 0 0-1.155 1.144a10.5 10.5 0 0 0 0 2.448c.07.606.556 1.077 1.154 1.144c.795.09 1.617.09 2.412 0a1.31 1.31 0 0 0 1.154-1.144a10.5 10.5 0 0 0 0-2.448a1.31 1.31 0 0 0-1.154-1.144m-14 7a11 11 0 0 0-2.412 0a1.31 1.31 0 0 0-1.154 1.144a10.5 10.5 0 0 0 0 2.448c.07.606.556 1.077 1.154 1.144c.795.09 1.617.09 2.412 0a1.31 1.31 0 0 0 1.154-1.144a10.6 10.6 0 0 0 0-2.448a1.31 1.31 0 0 0-1.154-1.144m7 0a11 11 0 0 0-2.411 0a1.31 1.31 0 0 0-1.155 1.144a10.5 10.5 0 0 0 0 2.448c.07.606.556 1.077 1.154 1.144c.795.09 1.617.09 2.412 0a1.31 1.31 0 0 0 1.154-1.144a10.5 10.5 0 0 0 0-2.448a1.31 1.31 0 0 0-1.154-1.144m7 0a11 11 0 0 0-2.411 0a1.31 1.31 0 0 0-1.155 1.144a10.5 10.5 0 0 0 0 2.448c.07.606.556 1.077 1.154 1.144c.795.09 1.617.09 2.412 0a1.31 1.31 0 0 0 1.154-1.144a10.5 10.5 0 0 0 0-2.448a1.31 1.31 0 0 0-1.154-1.144"></path></svg>);
}

export function SolarGalleryOutline(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="currentColor" fillRule="evenodd" clipRule="evenodd"><path d="M16 6.75a1.25 1.25 0 1 0 0 2.5a1.25 1.25 0 0 0 0-2.5M13.25 8a2.75 2.75 0 1 1 5.5 0a2.75 2.75 0 0 1-5.5 0"></path><path d="M11.943 1.25h.114c2.309 0 4.118 0 5.53.19c1.444.194 2.584.6 3.479 1.494c.895.895 1.3 2.035 1.494 3.48c.19 1.411.19 3.22.19 5.529v.114c0 2.309 0 4.118-.19 5.53c-.194 1.444-.6 2.584-1.494 3.479c-.895.895-2.035 1.3-3.48 1.494c-1.411.19-3.22.19-5.529.19h-.114c-2.309 0-4.118 0-5.53-.19c-1.444-.194-2.584-.6-3.479-1.494c-.895-.895-1.3-2.035-1.494-3.48c-.19-1.411-.19-3.22-.19-5.529v-.114c0-2.309 0-4.118.19-5.53c.194-1.444.6-2.584 1.494-3.479c.895-.895 2.035-1.3 3.48-1.494c1.411-.19 3.22-.19 5.529-.19M3.995 20.005c-.57-.57-.897-1.34-1.069-2.619c-.153-1.141-.173-2.597-.176-4.546l1.495-1.308a1.55 1.55 0 0 1 2.117.07l4.29 4.29a2.75 2.75 0 0 0 3.526.306l.298-.21a2.25 2.25 0 0 1 2.799.168l3.223 2.902q.053.047.111.083a3 3 0 0 1-.604.864c-.57.57-1.34.897-2.619 1.069c-1.3.174-3.008.176-5.386.176s-4.086-.002-5.386-.176c-1.279-.172-2.05-.5-2.62-1.069m2.62-17.079c-1.279.172-2.05.5-2.62 1.069c-.569.57-.896 1.34-1.068 2.619c-.145 1.08-.17 2.44-.175 4.233l.507-.444a3.05 3.05 0 0 1 4.165.139l4.29 4.29a1.25 1.25 0 0 0 1.602.138l.298-.21a3.75 3.75 0 0 1 4.665.281l2.774 2.497l.022-.152c.174-1.3.176-3.008.176-5.386s-.002-4.086-.176-5.386c-.172-1.279-.5-2.05-1.069-2.62c-.57-.569-1.34-.896-2.619-1.068c-1.3-.174-3.008-.176-5.386-.176s-4.086.002-5.386.176"></path></g></svg>);
}


export function StreamlineFreehandCryptoCurrencyUsdCoin(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M7.824 14.392a.32.32 0 0 0 .43-.13a.32.32 0 0 0-.14-.428a3.55 3.55 0 0 1-1.706-2.753a5.3 5.3 0 0 1 0-1.436c.071-.483.202-.955.39-1.406c.4-1.1 1.2-2.009 2.243-2.543a.28.28 0 0 0 .16-.369a.28.28 0 0 0-.36-.15A5.13 5.13 0 0 0 5.9 7.83a5.47 5.47 0 0 0-.489 3.41a4.23 4.23 0 0 0 2.413 3.152m8.198.628a4.93 4.93 0 0 0 2.623-2.931a5.8 5.8 0 0 0 .329-1.696a5.2 5.2 0 0 0-.19-1.715a4.3 4.3 0 0 0-2.603-2.942a.279.279 0 1 0-.229.509a3.73 3.73 0 0 1 1.845 2.672c.097.472.134.955.11 1.436q-.027.727-.22 1.426a4.24 4.24 0 0 1-1.934 2.673a.31.31 0 0 0-.15.419a.32.32 0 0 0 .419.15m-4.189-4.518a8 8 0 0 1 1.676 0c.2.06.339.22.468.538l.1.45a2.43 2.43 0 0 1-.927 1.814a1.59 1.59 0 0 1-1.885.18a1.1 1.1 0 0 1-.35-.36a5 5 0 0 1-.358-.837a.31.31 0 0 0-.277-.217a.31.31 0 0 0-.3.178a.33.33 0 0 0-.021.238q.13.52.368.998c.127.238.304.445.52.608c.25.19.54.327.847.399a1 1 0 0 0-.06.2q-.015.173 0 .348a1.4 1.4 0 0 0 0 .35q.058.422.16.837a.33.33 0 0 0 .319.31a.32.32 0 0 0 .319-.32c.06-.269.14-.508.2-.788V15.1a1.4 1.4 0 0 0 0-.349v-.25a2.8 2.8 0 0 0 1.046-.528a3.37 3.37 0 0 0 1.406-2.513a3 3 0 0 0-.06-.478c0-.13-.07-.26-.11-.39a1.72 1.72 0 0 0-1.126-1.186a9 9 0 0 0-1.945 0c-.29 0-.572-.091-.807-.26a.93.93 0 0 1-.36-.697c.009-.388.134-.763.36-1.077c.232-.346.539-.636.897-.848a1.13 1.13 0 0 1 1.097-.1a1.36 1.36 0 0 1 .738.918a.27.27 0 0 0 .33.209a.28.28 0 0 0 .219-.33a2 2 0 0 0-.998-1.385a1.7 1.7 0 0 0-.598-.18c.05-.14.1-.27.14-.419q.015-.13 0-.259a1 1 0 0 0 0-.25c-.05-.209-.15-.368-.22-.578a.27.27 0 0 0-.154-.264a.29.29 0 0 0-.404.234a3.4 3.4 0 0 0-.24.599q-.015.13 0 .26a2 2 0 0 0 0 .248c0 .16.09.31.13.47a2.4 2.4 0 0 0-.419.149a3.7 3.7 0 0 0-1.237.997a2.87 2.87 0 0 0-.598 1.576a1.9 1.9 0 0 0 .658 1.496c.407.351.92.558 1.456.588" strokeWidth={0.5} stroke="currentColor"></path><path fill="currentColor" d="M23.262 14.552c-.16 2.453-1.496 3.77-2.443 4.916c-2.334 2.793-5.844 3.391-8.637 3.361A12.66 12.66 0 0 1 6.2 21.383a10.4 10.4 0 0 1-3.221-2.623a10.15 10.15 0 0 1-2.184-6.283c0-1.176-.768-1.107-.768-.06A9.6 9.6 0 0 0 2.26 19.31a11.05 11.05 0 0 0 3.4 2.992a13.5 13.5 0 0 0 6.512 1.645c2.992 0 6.852-.768 9.335-3.87C22.823 18.382 24 17.126 24 13.885c-.17-.589-.509-.499-.738.668" strokeWidth={0.5} stroke="currentColor"></path><path fill="currentColor" d="M3.446 16.566q.762.782 1.666 1.396q.891.575 1.865.998c.856.39 1.757.67 2.682.837c.917.174 1.85.254 2.783.24a24 24 0 0 0 4.388-.589c3.42-.728 6.322-4.577 6.651-7.659c.08-3.69-.688-7.33-4.787-9.813a12.1 12.1 0 0 0-14.33.918a8.74 8.74 0 0 0-3.37 8.487a9.4 9.4 0 0 0 2.452 5.185M5.052 3.702a11.17 11.17 0 0 1 13.164-.908a9.39 9.39 0 0 1 4.637 7.19c.39 4.648-3.83 8.377-6.891 8.976c-1.16.226-2.339.337-3.52.329c-.882 0-1.76-.09-2.623-.27a11 11 0 0 1-2.483-.817a12 12 0 0 1-1.736-.998a9.6 9.6 0 0 1-1.545-1.236c-3.87-4.059-2.583-9.215.997-12.266" strokeWidth={0.5} stroke="currentColor"></path></svg>);
}

export function StreamlineUltimateCryptoCurrencyBitcoinDollarExchangeBold(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M21.216 16.43a.48.48 0 0 0-.682 0l-1.92 1.92a.47.47 0 0 0-.106.528a.49.49 0 0 0 .442.297h.538a.25.25 0 0 1 .201.115a.2.2 0 0 1 0 .221a3.84 3.84 0 0 1-3.6 2.093a.96.96 0 0 0 0 1.92c2.88 0 5.223-1.814 5.664-4.147a.25.25 0 0 1 .24-.192h.807a.47.47 0 0 0 .442-.298a.46.46 0 0 0-.106-.518ZM2.311 7.548c.088.091.21.14.336.135a.45.45 0 0 0 .336-.135l1.92-1.92a.48.48 0 0 0-.345-.816H4.02a.25.25 0 0 1-.201-.106a.25.25 0 0 1 0-.23a3.84 3.84 0 0 1 3.61-2.074a.96.96 0 0 0 0-1.92A5.59 5.59 0 0 0 1.764 4.63a.25.25 0 0 1-.24.192H.718a.48.48 0 0 0-.442.297a.49.49 0 0 0 .105.528Zm7.768 7.336a.73.73 0 0 0-.72-.72h-2.4a.24.24 0 0 0-.24.24v.96c0 .132.107.24.24.24h2.4a.73.73 0 0 0 .72-.72m-.721 2.15h-2.4a.24.24 0 0 0-.24.24v.96c0 .133.108.24.24.24h2.4a.72.72 0 0 0 0-1.44" strokeWidth={0.5} stroke="currentColor"></path><path fill="currentColor" d="M8.158 9.123c-5.543 0-9.007 6-6.236 10.8s9.7 4.802 12.472.001a7.2 7.2 0 0 0 .965-3.6a7.22 7.22 0 0 0-7.2-7.201m-1.92 11.521v-.48a.24.24 0 0 0-.24-.24a.71.71 0 0 1-.72-.73v-5.76a.72.72 0 0 1 .72-.72a.24.24 0 0 0 .24-.24v-.47a.72.72 0 0 1 1.44 0v.48c0 .132.108.24.24.24h.48a.24.24 0 0 0 .24-.24v-.48a.72.72 0 0 1 1.44 0v.69a.24.24 0 0 0 .145.221a2.13 2.13 0 0 1 .854 3.265a.23.23 0 0 0 0 .288a2.2 2.2 0 0 1 .442 1.296a2.17 2.17 0 0 1-1.297 1.978a.24.24 0 0 0-.144.21v.692a.72.72 0 1 1-1.44 0v-.48a.24.24 0 0 0-.24-.24h-.48a.24.24 0 0 0-.24.24v.48a.72.72 0 0 1-1.44 0m12.241-9.601c4.064 0 6.605-4.4 4.572-7.92c-2.032-3.521-7.113-3.521-9.146 0a5.28 5.28 0 0 0 4.573 7.92m1.2-8.41a.72.72 0 0 1 0 1.44h-1.633a.355.355 0 0 0-.345.355a.35.35 0 0 0 .22.326l1.652.663c.68.275 1.126.936 1.123 1.67c0 .808-.544 1.514-1.325 1.719a.24.24 0 0 0-.173.23v.087a.72.72 0 0 1-1.44 0a.24.24 0 0 0-.24-.24h-.24a.72.72 0 1 1 0-1.44h1.623a.346.346 0 0 0 .355-.346a.355.355 0 0 0-.22-.336l-1.652-.653c-1.284-.513-1.53-2.223-.444-3.078c.188-.148.405-.257.636-.32a.24.24 0 0 0 .182-.24v-.068a.72.72 0 0 1 1.44 0c0 .133.108.24.24.24Z" strokeWidth={0.5} stroke="currentColor"></path></svg>);
}


export function SolarGalleryWideOutline(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="currentColor" fillRule="evenodd" clipRule="evenodd" strokeWidth={0.5} stroke="currentColor"><path d="M17.141 2.374c-.924-.124-2.1-.124-3.568-.124h-3.321c-1.467 0-2.644 0-3.568.124c-.957.128-1.755.401-2.388 1.032c-.66.658-.931 1.495-1.053 2.504l-.006.05l.003.195q-.319.208-.599.486c-.748.749-1.08 1.698-1.238 2.87c-.153 1.14-.153 2.595-.153 4.433v.545c.001 1.625.013 2.957.153 4c.158 1.172.49 2.121 1.238 2.87c.749.748 1.698 1.08 2.87 1.238c1.14.153 2.595.153 4.433.153h4.112c1.838 0 3.294 0 4.433-.153c1.172-.158 2.121-.49 2.87-1.238c.748-.749 1.08-1.698 1.238-2.87c.153-1.14.153-2.595.153-4.433v-.112c0-1.838 0-3.294-.153-4.433c-.158-1.172-.49-2.121-1.238-2.87a3.7 3.7 0 0 0-.772-.593v-.093l-.005-.045c-.122-1.009-.392-1.846-1.053-2.504c-.633-.63-1.43-.904-2.388-1.032M2.751 14.84c.003 1.475.022 2.58.139 3.45c.135 1.005.389 1.585.812 2.008s1.003.677 2.009.812c1.028.138 2.382.14 4.289.14h4c1.907 0 3.262-.002 4.29-.14c.763-.102 1.281-.273 1.672-.535l-2.687-2.419a2.25 2.25 0 0 0-2.8-.168l-.297.21a2.75 2.75 0 0 1-3.526-.306l-4.29-4.29a1.55 1.55 0 0 0-2.117-.07zm15.527 2.201l2.588 2.33c.106-.296.186-.65.244-1.082c.138-1.027.14-2.382.14-4.289s-.002-3.261-.14-4.29c-.135-1.005-.389-1.585-.812-2.008s-1.003-.677-2.009-.812c-1.027-.138-2.382-.14-4.289-.14h-4c-1.907 0-3.261.002-4.29.14c-1.005.135-1.585.389-2.008.812S3.025 8.705 2.89 9.71c-.109.807-.133 1.816-.138 3.135l.506-.443a3.05 3.05 0 0 1 4.165.139l4.29 4.29a1.25 1.25 0 0 0 1.602.138l.298-.21a3.75 3.75 0 0 1 4.665.281M5.354 4.47c-.24.239-.412.551-.526 1.053q.328-.072.683-.119c1.14-.153 2.595-.153 4.433-.153h4.112c1.838 0 3.294 0 4.433.153q.256.034.5.081c-.115-.48-.285-.782-.518-1.015c-.308-.307-.737-.502-1.529-.608c-.813-.11-1.889-.111-3.424-.111h-3.211c-1.535 0-2.611.002-3.424.11c-.792.107-1.221.302-1.529.609"></path><path d="M17.5 8.25a2.25 2.25 0 1 0 0 4.5a2.25 2.25 0 0 0 0-4.5m0 1.5a.75.75 0 1 0 0 1.5a.75.75 0 0 0 0-1.5"></path></g></svg>);
}


export function TablerReportMoney(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.46}><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path><path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2m5 6h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3H10m2 0v1m0-8v1"></path></g></svg>);
}



export function SolarCheckCircleBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10" opacity={0.5} strokeWidth={0.5} stroke="currentColor"></path><path fill="currentColor" d="M16.03 8.97a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 1 1 1.06-1.06l1.47 1.47l2.235-2.235L14.97 8.97a.75.75 0 0 1 1.06 0" strokeWidth={0.5} stroke="currentColor"></path></svg>);
}


export function SolarClockCircleBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10" opacity={0.5} strokeWidth={0.5} stroke="currentColor"></path><path fill="currentColor" fillRule="evenodd" d="M12 7.25a.75.75 0 0 1 .75.75v3.69l2.28 2.28a.75.75 0 1 1-1.06 1.06l-2.5-2.5a.75.75 0 0 1-.22-.53V8a.75.75 0 0 1 .75-.75" clipRule="evenodd" strokeWidth={0.5} stroke="currentColor"></path></svg>);
}


export function MynauiActivitySquare(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}><path d="M17 12h-2l-2 5l-2-10l-2 5H7"></path><path d="M3 12c0-4.243 0-6.364 1.318-7.682S7.758 3 12 3s6.364 0 7.682 1.318S21 7.758 21 12s0 6.364-1.318 7.682S16.242 21 12 21s-6.364 0-7.682-1.318S3 16.242 3 12"></path></g></svg>);
}


export function StreamlineUltimateCryptoCurrencyBitcoinDollarExchange(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}><path d="M18.75 3.75h-2.033a1.342 1.342 0 0 0-.5 2.587l2.064.826a1.342 1.342 0 0 1-.5 2.587h-.531m0-6V3"></path><path d="M18.03 12.7a6.001 6.001 0 1 0-6.73-6.742m4.45 9.792a7.5 7.5 0 0 0-7.5-7.5m-6 3a7.5 7.5 0 1 0 12.5 8.25"></path><path d="M6.75 18.75v-6H9a1.5 1.5 0 1 1 0 3a1.5 1.5 0 1 1 0 3zm0-3H9m-.75-3v-1.5m0 7.5v1.5M.75 4.5L3 8.25L6.75 6"></path><path d="M8.189.9a6.75 6.75 0 0 0-4.417 6.886M23.25 19.5L21 15.75L17.25 18"></path><path d="M15.811 23.1a6.75 6.75 0 0 0 4.417-6.884"></path></g></svg>);
}


export function RivetIconsCheckAll(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" {...props}><path fill="currentColor" d="m4.261 13.49l6.614-10.822l-1.707-1.043l-5.43 8.885l-2.394-1.916l-1.25 1.562zM16 3h-4v2h4zm0 4h-6v2h6zm0 4v2H8v-2z" strokeWidth={0.5} stroke="currentColor"></path></svg>);
}


export function FluentSelectAllOn24Regular(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M15.28 9.03a.75.75 0 0 0-1.06-1.06L10 12.19l-1.97-1.97a.75.75 0 1 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0zM3 6.25A3.25 3.25 0 0 1 6.25 3h9.5A3.25 3.25 0 0 1 19 6.25v9.5A3.25 3.25 0 0 1 15.75 19h-9.5A3.25 3.25 0 0 1 3 15.75zM6.25 4.5A1.75 1.75 0 0 0 4.5 6.25v9.5c0 .966.784 1.75 1.75 1.75h9.5a1.75 1.75 0 0 0 1.75-1.75v-9.5a1.75 1.75 0 0 0-1.75-1.75zm2.991 17A3.25 3.25 0 0 1 6.5 19.999h9.746A3.753 3.753 0 0 0 20 16.246V6.5a3.25 3.25 0 0 1 1.5 2.741v7.005a5.254 5.254 0 0 1-5.254 5.254z" strokeWidth={0.5} stroke="currentColor"></path></svg>);
}


export function CircumBank(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M19.505 17.943v-7.581a1.49 1.49 0 0 0 1.39-1.12a1.47 1.47 0 0 0-.7-1.68l-7.45-4.3a1.52 1.52 0 0 0-1.49 0l-7.45 4.3a1.47 1.47 0 0 0-.7 1.68a1.49 1.49 0 0 0 1.45 1.12h.13v7.57h-.12a1.5 1.5 0 0 0 0 3h14.87a1.5 1.5 0 0 0 .07-2.989M4.555 9.362a.505.505 0 0 1-.25-.94l7.45-4.289a.47.47 0 0 1 .49 0L19.7 8.422a.5.5 0 0 1-.25.94Zm13.95 1v7.57H14.9v-7.57Zm-4.61 0v7.57h-3.61v-7.57Zm-4.61 0v7.57h-3.6v-7.57Zm10.15 9.57H4.565a.5.5 0 0 1-.5-.5a.5.5 0 0 1 .5-.5h14.87a.5.5 0 0 1 .5.5a.5.5 0 0 1-.5.5" strokeWidth={0.6} stroke="currentColor"></path></svg>);
}



export function HugeiconsPieChart01(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M21 12.502a9.5 9.5 0 1 1-9.5-9.5"></path><path strokeLinejoin="round" d="m13.705 7.386l.876-2.613c.545-1.627.818-2.44 1.668-2.699s1.414.176 2.541 1.046a11.6 11.6 0 0 1 2.09 2.09c.87 1.127 1.304 1.69 1.046 2.54c-.259.851-1.072 1.124-2.7 1.67l-2.612.875c-1.909.64-2.863.96-3.367.457c-.503-.503-.183-1.457.458-3.366Z"></path></g></svg>);
}



export function StreamlinePlumpBuildingOffice(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 48 48" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4.3}><path d="M28.61 3.492a5.37 5.37 0 0 1 4.899 4.995C33.748 11.807 34 16.973 34 24c0 8.605-.189 14.836-.324 18.182A2.94 2.94 0 0 1 30.722 45H6.288a2.95 2.95 0 0 1-2.96-2.83C3.193 38.746 3 32.383 3 24c0-6.858.258-12.082.5-15.467a5.42 5.42 0 0 1 4.933-5.045C11.098 3.242 14.689 3 18.5 3c3.831 0 7.44.244 10.11.492"></path><path d="M30.722 45h11.07a2.957 2.957 0 0 0 2.968-2.836c.106-2.688.24-7 .24-11.664c0-3.563-.156-6.775-.325-9.202c-.188-2.72-2.296-4.858-5.017-5.047a104 104 0 0 0-5.775-.241M23.416 45l.006-.105c.043-1.1.078-2.677.078-4.895s-.035-3.795-.078-4.895c-.059-1.488-.89-2.746-2.365-2.95A19 19 0 0 0 18.5 32a19 19 0 0 0-2.557.155c-1.475.204-2.306 1.462-2.365 2.95c-.043 1.1-.078 2.677-.078 4.895a127 127 0 0 0 .084 5M13 12v2m0 9v2m11-13v2m0 9v2"></path></g></svg>);
}


export function HugeiconsHome07(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}><path d="m12.892 2.81l8.596 6.785A1.347 1.347 0 0 1 20.653 12H20v3.5c0 2.828 0 4.243-.879 5.121c-.878.879-2.293.879-5.121.879h-4c-2.828 0-4.243 0-5.121-.879C4 19.743 4 18.328 4 15.5V12h-.653a1.347 1.347 0 0 1-.835-2.405l8.596-6.785a1.44 1.44 0 0 1 1.784 0"></path><path d="M14.5 21.5V17c0-.935 0-1.402-.201-1.75a1.5 1.5 0 0 0-.549-.549c-.348-.201-.815-.201-1.75-.201s-1.402 0-1.75.201a1.5 1.5 0 0 0-.549.549c-.201.348-.201.815-.201 1.75v4.5"></path></g></svg>);
}


export function FluentMegaphoneLoud28Regular(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 28 28" {...props}><path fill="currentColor" d="M17.526 4.466a.75.75 0 1 0 1.449.388l.647-2.415a.75.75 0 1 0-1.45-.388zM24.78 3.22a.75.75 0 0 1 0 1.06l-2.5 2.5a.75.75 0 1 1-1.061-1.06l2.5-2.5a.75.75 0 0 1 1.06 0m-14.6 20.484a4.75 4.75 0 0 0 8.472-4.236l3.827-1.913a2.75 2.75 0 0 0 .715-4.404L14.85 4.806a2.75 2.75 0 0 0-4.404.715L3.291 19.83a2.75 2.75 0 0 0 .516 3.174l1.19 1.19a2.75 2.75 0 0 0 3.174.515zm1.349-.674l5.775-2.888a3.25 3.25 0 0 1-5.776 2.888m.258-16.838a1.25 1.25 0 0 1 2.002-.325l8.344 8.344a1.25 1.25 0 0 1-.325 2.002L7.5 23.368a1.25 1.25 0 0 1-1.443-.234l-1.19-1.19a1.25 1.25 0 0 1-.234-1.443zM22.5 9.752a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75"></path></svg>);
}


export function IonBeerOutline(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={512} height={512} viewBox="0 0 512 512" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} d="M352 200v240a40.12 40.12 0 0 1-40 40H136a40.12 40.12 0 0 1-40-40V224"></path><path fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit={10} strokeWidth={32} d="M352 224h40a56.16 56.16 0 0 1 56 56v80a56.16 56.16 0 0 1-56 56h-40"></path><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} d="M224 256v160m64-160v160M160 256v160m160-304a48 48 0 0 1 0 96c-13.25 0-29.31-7.31-38-16H160c-8 22-27 32-48 32a48 48 0 0 1 0-96a47.9 47.9 0 0 1 26 9"></path><path fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit={10} strokeWidth={32} d="M91.86 132.43a40 40 0 1 1 60.46-52S160 91 160 96m-14.17-31.29C163.22 44.89 187.57 32 216 32c52.38 0 94 42.84 94 95.21a95 95 0 0 1-1.67 17.79"></path></svg>);
}


export function StreamlineFreehandDonationCharityDonateBag2(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="currentColor" fillRule="evenodd" clipRule="evenodd" strokeWidth={0.6} stroke="currentColor"><path d="M11.303 17.343a4.8 4.8 0 0 0-1.91-.35a2.4 2.4 0 0 1-.69-.11a.43.43 0 0 1-.32-.25c-.45-1.13 1.57-1.29 2.38-1.06a.28.28 0 1 0 .18-.53a3.1 3.1 0 0 0-1-.2a1 1 0 0 0 .05-.14q.04-.132.05-.27a2 2 0 0 0 0-.26c0-.23-.09-.42-.12-.64a.32.32 0 0 0-.594-.199a.3.3 0 0 0-.036.12q-.155.304-.26.63q-.045.13-.06.27a3 3 0 0 0 0 .28q.021.116.06.23q-.389.052-.75.21a1.45 1.45 0 0 0-.81 1.92a1.4 1.4 0 0 0 .85.91c.6.166 1.218.257 1.84.27c.38 0 .76 0 .83.44s-.33.72-.8.89a3.07 3.07 0 0 1-1.72.14a1.2 1.2 0 0 1-.47-.26a4 4 0 0 1-.38-.39a.32.32 0 0 0-.5.4q.246.354.57.64a2 2 0 0 0 .55.31q.277.102.57.14v.07q-.015.134 0 .27a1 1 0 0 0 0 .26c0 .23.08.42.12.64a.32.32 0 1 0 .63.08q.15-.307.25-.63q.045-.133.06-.27a.9.9 0 0 0 0-.28a.7.7 0 0 0 0-.14a3.8 3.8 0 0 0 1.14-.27a1.68 1.68 0 0 0 .99-1.8a1.38 1.38 0 0 0-.7-1.07m1-7.121c-.34.42.62.73.89.38a1.45 1.45 0 0 0 .27-.56c0-.26-.43-.39-.78-.17c-.03.05-.31.27-.38.35"></path><path d="M20.913 6.643a.33.33 0 0 0-.44.12a1.89 1.89 0 0 1-1.29.94q-.194.03-.39 0q-.991-.195-2-.23c-.74.08-2 .87-3.07 1.06a1 1 0 0 1-1.27-.54c-.16-.32.14-.47.44-.66a6.5 6.5 0 0 0 2.17-1.66a1.57 1.57 0 0 0 .12-1.4c-.42-1.2-1.16-1.53-1.91-1.41a2.77 2.77 0 0 0-2 1.35c-.13.25.22.54.51.33a2.1 2.1 0 0 1 1.22-.82c.56-.22 1.11 0 1.35.83c.16.57-.26.88-.72 1.16s-1.79 1.1-1.89 1.2a1.26 1.26 0 0 0-.21 1.59c.95 1.8 2.63 1.1 3.77.56a10 10 0 0 1 1.63-.72q.941-.004 1.87.14q.294.008.58-.06a2.65 2.65 0 0 0 1-.5a2.8 2.8 0 0 0 .62-.84a.33.33 0 0 0-.09-.44"></path><path d="M12.233 5.633c-1.61-1.94-4.22-1-4.37-1a3.4 3.4 0 0 0-1.71 1.54c-1 1.62-1.07 3.67.86 4.69c.26.11 1.1-.22.6-.51c-1.38-.65-1.45-2.31-.61-3.61a3.23 3.23 0 0 1 1.85-1.33a3.42 3.42 0 0 1 2.33.24c.19.1.363.232.51.39c.31.34.84-.05.54-.41m9.09-1.77l-2.5-1.34c-.72-.44-1.4-1.09-2.13-1.6a5 5 0 0 0-1.78-.86a3.47 3.47 0 0 0-3.16 1q-.774.807-1.42 1.72q-.372.526-.65 1.11c.1.22.29.28.56.17q.285-.448.63-.85q.675-.786 1.47-1.45a2.6 2.6 0 0 1 2.33-.67a5.6 5.6 0 0 1 1.8.92q.926.668 1.92 1.23l2.66 1.18a.31.31 0 0 0 .42-.15a.32.32 0 0 0-.15-.41m-10.52 7.01q-1.001-.03-2 .06c-.24 0-2.44.33-2.91.42a2.13 2.13 0 0 0-1.26.64c-.16.27-.19.64.34 1.08a.33.33 0 0 0 .18.08a10 10 0 0 0-.91 1.29a15 15 0 0 0-.85 1.73c-.17.41-.33.83-.47 1.26q-.212.654-.34 1.33a4.7 4.7 0 0 0-.08 1c.007.339.057.675.15 1q.115.35.28.68q.165.332.37.64a3.84 3.84 0 0 0 2.21 1.68c1.283.2 2.585.258 3.88.17a18.5 18.5 0 0 0 4.4-.15a3.57 3.57 0 0 0 1.88-1a3 3 0 0 0 .65-1.15c.171-.58.249-1.185.23-1.79a13.7 13.7 0 0 0-.35-3.35a6.6 6.6 0 0 0-.93-2.13a5 5 0 0 0-.56-.66a7 7 0 0 0-.63-.55a4 4 0 0 0-.31-.2l.18-.16a.84.84 0 0 0 .28-.64a.91.91 0 0 0-.41-.71c-.82-.64-1.64-.52-3.02-.57m2.44 1.24a.4.4 0 0 1 0 .09q-.166.144-.31.31a.83.83 0 0 0-.17.76a.56.56 0 0 0 .17.27c.12.12.45.31.52.37q.28.23.53.49q.245.241.43.53a5.6 5.6 0 0 1 .75 1.84c.217 1.015.31 2.053.28 3.09c.006.42-.037.84-.13 1.25a2.07 2.07 0 0 1-.48 1a3.13 3.13 0 0 1-1.89.76a23 23 0 0 1-3.58 0a17.6 17.6 0 0 1-3.66 0a3 3 0 0 1-1.7-1.28q-.18-.255-.33-.53a2.7 2.7 0 0 1-.24-.55a2.8 2.8 0 0 1-.15-.8a4 4 0 0 1 0-.84q.103-.634.28-1.25c.12-.42.26-.83.41-1.23a12.5 12.5 0 0 1 .77-1.66a9 9 0 0 1 1-1.5c.26-.3-.16-.44-.43-.66c-.12-.11-.19-.18-.2-.26s.09-.06.15-.1a2.5 2.5 0 0 1 .74-.22c.78-.13 1.58-.24 2.38-.3a17 17 0 0 1 2.36-.05q.834.008 1.66.11c.307.043.598.167.84.36"></path></g></svg>);
}

export function TablerShirtSport(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4}><path d="m15 4l6 2v5h-3v8a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-8H3V6l6-2a3 3 0 0 0 6 0"></path><path d="M10.5 11H13l-1.5 5"></path></g></svg>);
}


export function IcTwotoneRamenDining(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="m8.73 18.39l1.27.5V20h4v-1.11l1.27-.5c2.16-.85 3.74-2.47 4.4-4.39H4.34c.65 1.92 2.24 3.54 4.39 4.39" opacity={0.3} strokeWidth={0.6} stroke="currentColor"></path><path fill="currentColor" d="M22 3.51V2L4 3.99V12H2c0 3.69 2.47 6.86 6 8.25V22h8v-1.75c3.53-1.39 6-4.56 6-8.25H10.5V8H22V6.5H10.5V4.78zM8 5.06l1-.11V6.5H8zM8 8h1v4H8zM5.5 5.34l1-.11V6.5h-1zM5.5 8h1v4h-1zm14.16 6c-.66 1.92-2.24 3.54-4.4 4.39l-1.26.5V20h-4v-1.11l-1.27-.5c-2.16-.85-3.74-2.47-4.4-4.39z" strokeWidth={0.6} stroke="currentColor"></path></svg>);
}



export function FluentMdl2Education(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={2048} height={2048} viewBox="0 0 2048 2048" {...props}><path fill="currentColor" d="M1582 1065q41 72 61 150t21 161v103l-640 321l-640-321q0-60 1-112t9-101t24-98t48-103L256 960v587q29 10 52 28t41 42t26 52t9 59v320H0v-320q0-30 9-58t26-53t40-42t53-28V896L0 832l1024-512l1024 512zM256 1728q0-26-19-45t-45-19t-45 19t-19 45v192h128zm30-896l738 369l738-369l-738-369zm1250 568q0-77-15-143t-53-135l-444 222l-444-222q-33 58-50 122t-18 132v24l512 256z" strokeWidth={51} stroke="currentColor"></path></svg>);
}

export function StreamlinePixelComputersDevicesElectronicsLaptop(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 32 32" {...props}><path fill="currentColor" d="M30.47 26.665H1.52v-3.05H0v4.57h1.52v1.53h28.95v-1.53H32v-4.57h-1.53z" strokeWidth={1} stroke="currentColor"></path><path fill="currentColor" d="M28.95 20.565h1.52v3.05h-1.52Zm-10.67-9.14h1.53v1.52h-1.53Zm-4.57 12.19h4.57v1.52h-4.57Zm1.53-12.19h1.52v1.52h-1.52Zm-3.05 0h1.52v1.52h-1.52Zm-7.62-9.14h22.86v1.52H4.57Z" strokeWidth={1} stroke="currentColor"></path><path fill="currentColor" d="M28.95 20.565V3.805h-1.52v15.24H4.57V3.805H3.05v16.76zm-27.43 0h1.53v3.05H1.52Z" strokeWidth={1} stroke="currentColor"></path></svg>);
}


export function SolarHeadphonesRoundSoundBroken(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" d="M22 17v-5c0-1.821-.487-3.53-1.338-5M2 18v-6C2 6.477 6.477 2 12 2c1.821 0 3.53.487 5 1.338"></path><path d="M8 15.187c0-.578 0-.867-.069-1.097a1.53 1.53 0 0 0-1.095-1.059c-.225-.054-.5-.03-1.052.015c-.956.079-1.435.118-1.825.27c-.899.347-1.585 1.123-1.846 2.088C2 15.823 2 16.324 2 17.328v.186c0 1.03 0 1.544.123 1.979a3.1 3.1 0 0 0 1.588 1.944c.392.195.878.275 1.85.436c.645.106.968.16 1.229.106a1.52 1.52 0 0 0 1.119-1C8 20.718 8 20.376 8 19.693zm8 0c0-.578 0-.867.069-1.097a1.53 1.53 0 0 1 1.095-1.059c.225-.054.5-.03 1.051.015c.957.079 1.436.118 1.826.27c.899.347 1.585 1.123 1.846 2.088c.113.419.113.92.113 1.924v.186c0 1.03 0 1.544-.123 1.979a3.1 3.1 0 0 1-1.588 1.944c-.392.195-.878.275-1.85.436c-.645.106-.968.16-1.229.106a1.52 1.52 0 0 1-1.119-1C16 20.718 16 20.376 16 19.693z"></path><path strokeLinecap="round" d="M12 6.5v5M15 8v2M9 8v2"></path></g></svg>);
}


export function StreamlineFlexGasStationFuelPetroleumRemix(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 14 14" {...props}><path fill="currentColor" fillRule="evenodd" d="M2.465 1.845a27 27 0 0 1 4.529 0c.611.05 1.093.555 1.123 1.19c.099 2.15.118 4.25.057 6.38a.6.6 0 0 0-.014.132v.238l.001.06q-.032.954-.085 1.921a.33.33 0 0 1-.293.314a27.5 27.5 0 0 1-6.107 0a.33.33 0 0 1-.293-.314a86 86 0 0 1-.04-8.732a1.236 1.236 0 0 1 1.122-1.189m6.87 9.792l-.01.198a1.58 1.58 0 0 1-1.409 1.488a28.8 28.8 0 0 1-6.374 0a1.58 1.58 0 0 1-1.408-1.488a87 87 0 0 1-.04-8.858C.15 1.737 1.101.703 2.362.599a28 28 0 0 1 4.733 0c1.26.104 2.212 1.139 2.27 2.378a87 87 0 0 1 .046 6.862c.027.432.373.764.902.764c.323 0 .533-.132.708-.42c.199-.325.333-.831.398-1.487c.12-1.191-.007-2.621-.107-3.745v-.003l-.027-.309c-.074-.847.333-1.621.992-2.106L13.005 2a.625.625 0 0 1 .74 1.006l-.727.535c-.349.257-.519.627-.487.991l.028.317l.02.235h.796a.625.625 0 1 1 0 1.25h-.7c.05.815.068 1.693-.01 2.487c-.073.722-.231 1.45-.576 2.015c-.369.604-.955 1.018-1.775 1.018c-.346 0-.681-.076-.979-.216m-6.34-3.742a.75.75 0 0 1 .75.75v.886a.75.75 0 0 1-1.5 0v-.886a.75.75 0 0 1 .75-.75m3.937-5.302a26 26 0 0 0-4.406 0a.49.49 0 0 0-.435.476a86 86 0 0 0-.087 3.139a.496.496 0 0 0 .483.5q1.11.031 2.242.032q1.133-.001 2.243-.032a.496.496 0 0 0 .483-.5a85 85 0 0 0-.088-3.14a.49.49 0 0 0-.435-.475" clipRule="evenodd" strokeWidth={0.6} stroke="currentColor"></path></svg>);
}


export function StreamlineCyberDeliveryPackageOpen(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} strokeWidth={1.8}><path d="M20.5 13.25v6.25l-9 4l-9-4v-6.111m9-.389v10.5m9-14.5l-9 4l-9-4m18 0l-9-4l-9 4"></path><path d="m2.5 9l-2-3.5l9-4l2 3.5m9 4l2-3.5l-8.5-4L11.5 5m0 8l-2 3.5l-9-4l2-3.5m9 4l2.5 3.5l9-4.5l-2.5-3"></path></g></svg>);
}

export function SolarCartLargeBroken(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M7.5 18a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3Zm9 0a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3Z"></path><path strokeLinecap="round" d="M11 9H8M2 3l.265.088c1.32.44 1.98.66 2.357 1.184S5 5.492 5 6.883V9.5c0 2.828 0 4.243.879 5.121c.878.879 2.293.879 5.121.879h2m6 0h-2"></path><path strokeLinecap="round" d="M5 6h3m-2.5 7h10.522c.96 0 1.439 0 1.815-.248s.564-.688.942-1.57l.429-1c.81-1.89 1.214-2.833.77-3.508C19.533 6 18.505 6 16.45 6H12"></path></g></svg>);
}


export function SolarHealthBroken(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none"><path stroke="currentColor" strokeLinecap="round" strokeWidth={1.8} d="M18.5 9h-2m0 0h-2m2 0V7m0 2v2"></path><path fill="currentColor" d="m8.962 19.379l.472-.583zM12 5.574l-.548.512a.75.75 0 0 0 1.096 0zm3.038 13.805l.473.582zM12 21v-.75zm-9.348-7.318a.75.75 0 1 0 1.283-.776zm3.885 2.489a.75.75 0 1 0-1.074 1.046zM2.75 9.318c0-2.905 1.268-4.7 2.836-5.315c1.565-.613 3.754-.175 5.866 2.083l1.096-1.024c-2.388-2.554-5.199-3.36-7.509-2.456C2.732 3.51 1.25 5.992 1.25 9.318zM15.51 19.96c1.493-1.211 3.281-2.834 4.703-4.647c1.407-1.794 2.537-3.879 2.537-5.997h-1.5c0 1.612-.88 3.364-2.218 5.071c-1.324 1.689-3.016 3.232-4.466 4.408zm7.24-10.644c0-3.325-1.482-5.807-3.79-6.71c-2.31-.905-5.12-.1-7.508 2.455l1.096 1.024c2.112-2.258 4.301-2.696 5.866-2.083c1.568.614 2.836 2.41 2.836 5.314zM8.49 19.961c1.27 1.032 2.152 1.789 3.51 1.789v-1.5c-.723 0-1.173-.324-2.566-1.454zm6.076-1.165c-1.393 1.13-1.843 1.454-2.566 1.454v1.5c1.358 0 2.24-.757 3.51-1.789zm-10.63-5.89C3.187 11.67 2.75 10.455 2.75 9.318h-1.5c0 1.512.576 3 1.402 4.364zm5.498 5.89a34 34 0 0 1-2.897-2.625l-1.074 1.046a35 35 0 0 0 3.026 2.744z"></path></g></svg>);
}

export function BiHouseHeart(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" {...props}><g fill="currentColor" strokeWidth={0.6} stroke="currentColor"><path d="M8 6.982C9.664 5.309 13.825 8.236 8 12C2.175 8.236 6.336 5.309 8 6.982"></path><path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.707L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.646a.5.5 0 0 0 .708-.707L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"></path></g></svg>);
}

export function StreamlinePlumpPaymentRecieve7Remix(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 48 48" {...props}><path fill="currentColor" fillRule="evenodd" d="M41.35 21.506c-1.995-.9-7.334-2.534-16.85-.074c-8.126 2.101-13.747 1.544-17.187.583c-.485-.135-.925-.07-1.187.06a.6.6 0 0 0-.219.17a.43.43 0 0 0-.075.225c-.179 1.799-.333 4.506-.333 8.486c0 5.898.338 8.993.592 10.477c.064.376.268.618.545.74c1.998.882 7.343 2.476 16.863.015c8.079-2.09 13.685-1.526 17.134-.55c.49.138.946.074 1.223-.064a.6.6 0 0 0 .236-.182a.45.45 0 0 0 .079-.233c.177-1.803.329-4.493.329-8.416c0-5.874-.34-8.978-.594-10.471c-.067-.39-.277-.64-.556-.766m1.645-3.646c1.571.71 2.579 2.126 2.854 3.74c.305 1.79.65 5.135.65 11.143c0 4.02-.154 6.846-.347 8.808c-.17 1.721-1.217 2.962-2.52 3.608c-1.253.62-2.74.708-4.087.328c-2.712-.767-7.594-1.353-15.045.573c-10.34 2.674-16.61 1.04-19.48-.228c-1.574-.695-2.595-2.105-2.872-3.726c-.305-1.783-.649-5.12-.649-11.15c0-4.078.158-6.921.353-8.882c.17-1.703 1.199-2.935 2.492-3.579c1.241-.618 2.712-.704 4.044-.332c2.706.755 7.608 1.336 15.111-.604c10.35-2.676 16.627-.994 19.496.3M26 24.63v-.058a2 2 0 0 0-4 0v.13a6.1 6.1 0 0 0-1.65.828c-1.026.733-1.968 1.953-1.968 3.567c0 .811.194 1.578.617 2.251c.415.662.974 1.113 1.52 1.425c.955.546 2.128.797 2.94.97l.121.026c.997.214 1.56.355 1.914.557a.7.7 0 0 1 .114.077a.6.6 0 0 1 .01.12c-.008.03-.055.15-.294.32a2.37 2.37 0 0 1-1.324.404a4.3 4.3 0 0 1-2.376-.733l-.007-.005a2 2 0 0 0-2.489 3.132l1.254-1.559a283 283 0 0 0-1.253 1.56h.001l.003.002l.005.005l.013.01l.031.024l.09.067q.11.08.287.196c.237.152.568.345.982.536c.403.185.894.372 1.459.515v.062a2 2 0 0 0 4 0v-.134a6.1 6.1 0 0 0 1.65-.828c1.026-.733 1.968-1.954 1.968-3.567c0-.811-.194-1.578-.617-2.251c-.415-.662-.975-1.113-1.52-1.425c-.956-.547-2.129-.797-2.94-.97l-.122-.026c-.996-.214-1.56-.355-1.913-.557a.7.7 0 0 1-.114-.077a.6.6 0 0 1-.01-.12c.007-.03.054-.15.294-.32a2.36 2.36 0 0 1 1.41-.403a4.3 4.3 0 0 1 2.29.731l.007.006a2 2 0 0 0 2.489-3.132l-1.254 1.559a197 197 0 0 0 1.252-1.56l-.003-.003l-.006-.004l-.012-.01l-.032-.024l-.09-.067a6 6 0 0 0-.287-.196a8 8 0 0 0-.982-.536A8.5 8.5 0 0 0 26 24.631m-.395 9.76l-.002-.004v-.002l-.001-.001zm-3.226-5.179l.002.003zm13.335 4.604a2 2 0 0 1 0-4h.976a2 2 0 1 1 0 4zm-21.428-2a2 2 0 0 1-2 2h-.976a2 2 0 0 1 0-4h.976a2 2 0 0 1 2 2M22 10.176a2 2 0 0 0 4 0V2.5a2 2 0 1 0-4 0zm-5.809 6.262a2 2 0 0 1-2-2V6.762a2 2 0 0 1 4 0v7.676a2 2 0 0 1-2 2m13.619-4.555a2 2 0 0 0 4 0V4.207a2 2 0 1 0-4 0z" clipRule="evenodd"></path></svg>);
}


export function StreamlinePlumpInsuranceHand(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 48 48" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4.3} d="M3 27.564S9 25 14 25c3.527 0 7.4 1.418 9.994 2.587c1.99.896 3.135 1.462 3.59 3.597c.317 1.483-.748 3.955-2.26 4.077l-1.065.086m0 0c-2.442 0-6.222-.724-6.222-.724m6.222.724c3.387 0 12.303-1.609 15.463-2.2c.754-.14 1.535-.243 2.252.027c.902.341 2.112 1.164 2.69 3.15c.452 1.552-.633 3.045-2.14 3.628C38.104 41.662 28.887 45 24.259 45C12 45 3 41.923 3 41.923M30.126 22.98c.032.923.604 1.717 1.516 1.857c.59.09 1.369.163 2.358.163a15.5 15.5 0 0 0 2.358-.163c.912-.14 1.484-.934 1.516-1.856c.037-1.06.08-2.703.105-5.002a212 212 0 0 0 5.002-.105c.922-.032 1.716-.604 1.856-1.516c.09-.59.163-1.369.163-2.358a15.5 15.5 0 0 0-.163-2.358c-.14-.912-.934-1.484-1.856-1.516c-1.06-.037-2.703-.08-5.002-.105a213 213 0 0 0-.105-5.002c-.032-.922-.604-1.716-1.516-1.856A15.6 15.6 0 0 0 34 3a15.5 15.5 0 0 0-2.358.163c-.912.14-1.484.934-1.516 1.856c-.037 1.06-.08 2.703-.105 5.002a212 212 0 0 0-5.002.105c-.922.032-1.716.604-1.856 1.516c-.09.59-.163 1.369-.163 2.358s.072 1.769.163 2.358c.14.912.934 1.484 1.856 1.516c1.06.037 2.703.08 5.002.105c.025 2.299.068 3.943.105 5.002Z"></path></svg>);
}


export function HugeiconsChartUp(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth={1.8}><path d="M20.5 10.5v9c0 .466 0 .699-.076.883a1 1 0 0 1-.541.54C19.699 21 19.466 21 19 21s-.699 0-.883-.076a1 1 0 0 1-.54-.541c-.077-.184-.077-.417-.077-.883v-9c0-.466 0-.699.076-.883a1 1 0 0 1 .541-.54C18.301 9 18.534 9 19 9s.699 0 .883.076a1 1 0 0 1 .54.541c.077.184.077.417.077.883Z"></path><path strokeLinecap="round" d="M16.5 3h3v3"></path><path strokeLinecap="round" d="M19 3.5s-4 5-14.5 8.5"></path><path d="M13.5 14v5.5c0 .466 0 .699-.076.883a1 1 0 0 1-.541.54C12.699 21 12.466 21 12 21s-.699 0-.883-.076a1 1 0 0 1-.54-.541c-.077-.184-.077-.417-.077-.883V14c0-.466 0-.699.076-.883a1 1 0 0 1 .541-.54c.184-.077.417-.077.883-.077s.699 0 .883.076a1 1 0 0 1 .54.541c.077.184.077.417.077.883Zm-7 2.5v3c0 .466 0 .699-.076.883a1 1 0 0 1-.541.54C5.699 21 5.466 21 5 21s-.699 0-.883-.076a1 1 0 0 1-.54-.541c-.077-.184-.077-.417-.077-.883v-3c0-.466 0-.699.076-.883a1 1 0 0 1 .541-.54C4.301 15 4.534 15 5 15s.699 0 .883.076a1 1 0 0 1 .54.541c.077.184.077.417.077.883Z"></path></g></svg>);
}

export function LoanIcon(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" width={2048} height={2048} style={{shapeRendering: 'geometricPrecision', textRendering: 'geometricPrecision', fillRule: 'evenodd', clipRule: 'evenodd'}}><defs><style dangerouslySetInnerHTML={{__html: ".fil0{fill:none}.fil1{fill:#212121;fill-rule:nonzero}" }} /></defs><g id="Layer_x0020_1"><path className="fil0" d="M0 0h2048v2048H0z" /><g id="_445077744"><path id="_445075656" className="fil0" d="M255.996 255.996h1536v1536h-1536z" /><path id="_445085112" className="fil1" d="M1551.33 1066.08h181.514c16.21 0 30.965 6.645 41.681 17.336 10.78 10.762 17.474 25.555 17.474 41.764v497.899c0 16.21-6.699 30.998-17.476 41.76-10.719 10.695-25.478 17.34-41.68 17.34H1551.33c-16.2 0-30.963-6.64-41.682-17.339-10.78-10.758-17.474-25.54-17.474-41.76v-497.9c0-16.219 6.691-31.006 17.471-41.765 10.719-10.697 25.478-17.335 41.685-17.335zm179.229 61.441h-176.943v493.217h176.943v-493.217z" /><path id="_445081272" className="fil1" d="M539.321 983.962c-16.501-3.777-32.943 6.539-36.72 23.04-3.778 16.502 6.537 32.944 23.04 36.722 29.669 6.892 103.262 79.437 145.82 121.389 8.637 8.514 16.101 15.871 21.565 21.076 12.26 11.664 31.656 11.18 43.32-1.08 11.664-12.26 11.18-31.655-1.08-43.32-5.771-5.497-12.76-12.386-20.845-20.357-47.07-46.399-128.465-126.634-175.1-137.47z" /><path id="_445083144" className="fil1" d="M426.642 1031.92c-14.05-9.41-33.07-5.648-42.48 8.401-9.41 14.05-5.649 33.07 8.4 42.48 7.056 4.715 12.174 7.9 17.387 11.141 13.44 8.36 27.554 17.14 40.312 28.552 21.738 19.46 43.573 41.321 64.837 62.613 23.876 23.904 47.054 47.113 70.477 67.243 12.856 11.001 32.199 9.497 43.199-3.36 11-12.856 9.496-32.199-3.36-43.2-21.694-18.645-43.95-40.93-66.876-63.883-21.432-21.46-43.44-43.496-67.476-65.012-17.366-15.535-33.423-25.523-48.712-35.032-6.069-3.775-12.016-7.476-15.708-9.943z" /><path id="_445083000" className="fil1" d="M1435.14 1212.15c-51.75-26.433-118.07-37.315-182.066-30.919-59.125 5.91-115.494 26.556-155.219 63.298v.12l-2.302 2.125.004.004c-16.367 15.35-25.662 24.063-65.4 24.264v.004c-53.108 3.29-100.127-.127-142.323-3.192-87.816-6.381-151.493-11.006-189.658 63.193l-54.48-28.08c56.707-110.246 137.305-104.39 248.458-96.314 40.473 2.94 85.57 6.218 134.4 3.192h1.8c14.298.017 18.647-1.954 22.824-5.541.583-.547 2.098-1.949 5.157-4.775l.06.066c50.137-46.343 119.228-72.184 190.678-79.324 75.135-7.51 153.764 5.659 215.907 37.4l-27.84 54.479zm-381.463-10.012c1.94-1.817 1.148-1.112-.08 0h.08zm73.467 335.33c-61.225 8.351-169.173 20.316-270.655 13.958-108.336-6.79-210.143-34.947-249.182-110.32l-.05.027-1.576-3.034c-6.76-12.992-11.474-22.05-15.945-40.84-4.119-17.329-33.658-47.182-71.893-79.695-62.098-52.809-144.275-108.24-188.159-136.381-.13.165-.281.337-.458.517-4.267 4.34-8.034 10.604-10.17 18.001l-.033-.01c-1.006 3.532-1.586 7.57-1.586 12.056 0 71.772 57.506 141.817 109.077 204.638 8.778 10.691 17.399 21.193 26.72 32.956 4.66 5.89 5.55 7.053 6.422 8.194 3.136 4.103 6.106 7.989 9.3 11.734l-.008.007c240.229 278.223 434.218 216.123 680.549 137.262 88.884-28.456 184.21-58.975 290.387-77.882l10.56 60.48c-102.985 18.339-195.741 48.035-282.227 75.724-267.978 85.79-479.004 153.349-745.703-155.63l-.12-.12c-4.56-5.349-7.914-9.739-11.458-14.375-2.94-3.844-5.425-7.12-5.704-7.471-7.502-9.47-16.66-20.625-25.998-31.999-58.269-70.977-123.24-150.115-123.24-243.518 0-9.82 1.556-19.593 4.26-28.965v-.12c5.08-17.587 14.466-32.918 25.29-43.922 13.249-13.472 29.622-21.463 45.394-21.463 4.193 0 8.591.638 13.163 1.958l7.8 3.48c41.409 26.089 135.653 88.614 205.542 148.048 47.19 40.13 84.495 80.538 92.052 112.336 2.714 11.4 5.98 17.678 10.664 26.68l1.577 3.035v.12c26.68 51.608 109.115 71.685 198.59 77.29 96.375 6.037 199.874-5.457 258.658-13.476l8.159 60.72z" /><path id="_445069440" className="fil1" d="M943.327 818.489V703.438c-35.913-10.313-62.26-25.785-79.044-46.602-16.69-20.814-25.13-46.038-25.13-75.668 0-30.006 9.47-55.229 28.41-75.669 19.036-20.441 44.26-32.162 75.764-35.349v-27.192h39.756v27.192c29.162 3.562 52.323 13.408 69.575 29.817 17.16 16.41 28.13 38.35 32.913 65.823l-69.481 9.097c-4.22-21.66-15.19-36.288-33.007-43.977v107.36c43.977 11.91 73.982 27.38 89.829 46.321 15.94 18.941 23.91 43.227 23.91 72.95 0 33.1-10.032 61.043-30.006 83.733-20.066 22.786-48.007 36.664-83.733 41.82v51.384h-39.756v-50.07c-31.692-3.846-57.478-15.66-77.263-35.445-19.785-19.69-32.35-47.633-37.882-83.733l71.732-7.69c2.906 14.629 8.438 27.288 16.502 37.883 7.97 10.595 16.972 18.285 26.911 23.066zm0-288.423c-10.877 3.657-19.41 9.938-25.88 18.658-6.376 8.816-9.564 18.566-9.564 29.163 0 9.657 2.907 18.752 8.721 27.003 5.906 8.346 14.815 15.097 26.723 20.254v-95.078zm39.756 292.268c13.785-2.531 24.942-8.908 33.57-19.035 8.626-10.22 12.94-22.128 12.94-35.912 0-12.284-3.657-22.785-10.879-31.693-7.22-8.908-19.128-15.752-35.631-20.441v107.08z" /></g></g></svg>
);
}



export function HugeiconsBriefcase02(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}><path d="M8.499 6.5c0-1.404 0-2.107.337-2.611a2 2 0 0 1 .552-.552C9.892 3 10.594 3 11.998 3c1.405 0 2.107 0 2.612.337a2 2 0 0 1 .552.552c.337.504.337 1.207.337 2.611m4.499 0H4a2 2 0 0 0-2 2a4 4 0 0 0 4 4h11.999a4 4 0 0 0 4-4a2 2 0 0 0-2-2M7.499 11v3m9 0v-3"></path><path d="M2.001 8.5L2 13.997c-.001 3.301-.002 4.951 1.023 5.977S5.698 21 9 21h6c3.3 0 4.95 0 5.975-1.025s1.025-2.674 1.026-5.974l.001-5.5"></path></g></svg>);
}


export function HugeiconsHoldPhone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeWidth={1.8} d="M21 20c-.643-1.287-2-2.976-2-4.472c0-1.699.367-3.794-.422-5.373c-.334-.666-.578-1.341-.578-2.1V4.43a.43.43 0 0 0-.429-.43A2.57 2.57 0 0 0 15 6.571M8 18l3.635 2.272c.24.15.446.35.604.586L13 22"></path><path strokeLinejoin="round" strokeWidth={1.8} d="M5.027 15c.055 1.097.218 1.78.705 2.268C6.464 18 7.642 18 10 18s3.535 0 4.268-.732C15 16.535 15 15.357 15 13V7c0-2.357 0-3.536-.732-4.268C13.535 2 12.357 2 10 2s-3.536 0-4.268.732c-.487.487-.65 1.171-.705 2.268"></path><path strokeLinecap="round" strokeWidth={1.8} d="M4.25 7.5h1.5a1.25 1.25 0 1 0 0-2.5h-1.5a1.25 1.25 0 1 0 0 2.5Zm0 0h2.5a1.25 1.25 0 1 1 0 2.5h-2.5m0-2.5a1.25 1.25 0 1 0 0 2.5m0 0h1.5a1.25 1.25 0 1 1 0 2.5h-1.5m0-2.5a1.25 1.25 0 1 0 0 2.5m0 0h1a1.25 1.25 0 1 1 0 2.5h-1a1.25 1.25 0 1 1 0-2.5Z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4} d="M10 15h.009"></path></g></svg>);
}


export function FluentWrenchSettings24Regular(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M16.5 2a5.5 5.5 0 0 0-5.348 6.789L2.841 17.1a2.871 2.871 0 1 0 4.06 4.06l4.115-4.113a6.47 6.47 0 0 1 1.172-3.293L5.84 20.1a1.371 1.371 0 0 1-1.94-1.94l8.624-8.622a.75.75 0 0 0 .18-.768a4 4 0 0 1 4.213-5.248l-1.844 1.844a1.25 1.25 0 0 0 0 1.768l1.793 1.793a1.25 1.25 0 0 0 1.767 0l1.845-1.845q.021.207.021.418a4 4 0 0 1-2.162 3.554a6.5 6.5 0 0 1 1.85.526A5.5 5.5 0 0 0 22 7.5c0-.767-.157-1.498-.442-2.163a.75.75 0 0 0-1.22-.236L17.75 7.69l-1.439-1.44L18.9 3.662a.75.75 0 0 0-.235-1.22A5.5 5.5 0 0 0 16.5 2m-2.223 11.976a2 2 0 0 1-1.441 2.496l-.584.144a5.7 5.7 0 0 0 .006 1.808l.54.13a2 2 0 0 1 1.45 2.51l-.187.631c.44.386.94.699 1.485.922l.493-.519a2 2 0 0 1 2.899 0l.499.525a5.3 5.3 0 0 0 1.482-.913l-.198-.686a2 2 0 0 1 1.442-2.496l.583-.144a5.7 5.7 0 0 0-.006-1.808l-.54-.13a2 2 0 0 1-1.449-2.51l.186-.63a5.3 5.3 0 0 0-1.484-.922l-.493.518a2 2 0 0 1-2.9 0l-.498-.525c-.544.22-1.044.53-1.483.912zM17.5 19c-.8 0-1.45-.672-1.45-1.5S16.7 16 17.5 16s1.45.672 1.45 1.5S18.3 19 17.5 19"></path></svg>);
}


export function StreamlineFreehandShoppingBagSide(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" fillRule="evenodd" d="M4.827 19.426c-.71-.63-1-.75-2.142.07c-.5.37-1.06.881-1.51 1.231c.5-3.732.65-2.451 1.85-12.74c0-.2.36-1.21.13-1.35c.23-.39-.46-.82-.64-.16s.27-1.001-.87 5.154c-.16 1.19-1.862 8.706-1.622 9.967a.66.66 0 0 0 .32.47c.741.42 1.602-.69 2.622-1.58c.254-.27.552-.493.881-.661a.3.3 0 0 1 .12.06c2.242 1.641 2.552 2.742 3.002 2.792a.35.35 0 0 0 .37-.32c.11-.42-2.16-2.612-2.511-2.933m.951-13.25c.51.09.64-1.73.7-1.891a5.6 5.6 0 0 1 1-1.651c1.742-2.092 3.003-.49 3.183-.61c.28.45 1.281-.11 0-.891A2.85 2.85 0 0 0 8.66.623c-1.802.36-2.632 1.69-3.063 3.362c-.14.68-.49 2.131.18 2.191m16.973.811a.84.84 0 0 0-.48-.55a11.7 11.7 0 0 0-3.773-.45a6.76 6.76 0 0 0-1.14-3.143c-1.592-2.202-4.544-2.002-5.615-.12a10.5 10.5 0 0 0-.86 3.362c-1.001 0-3.313.06-3.533.32s0 2.683 0 3.313c-.08 2.722.68 12.65.68 12.73c.12.62.41.67 1 .73c.862.09 4.715.28 6.076.2c.65 0 1.3-.11 1.951-.18c1-.11 3.002.12 4.523 0c.761-.08 2.172-.38 2.352-1.12c.31-1.021-.49-13.16-1.18-15.092M12.743 3.274a2.11 2.11 0 0 1 2.291-.76c1.432.28 2.332 2.061 2.602 3.502c-1.938.193-3.89.23-5.834.11c.15-.982.454-1.934.9-2.822zM22.86 21.638c-1.09.7-4.583.28-5.874.44a22 22 0 0 1-3.132.25c-4.894-.07-4.844.15-4.924-1c-.75-8.757-.9-10.008-.9-11.589V6.877c1 0 2-.07 2.661 0c-.35 2.071-.36 2.232-.3 2.352a.41.41 0 0 0 .33.26c.44.06.28-.23.78-2.562a39 39 0 0 0 6.186 0c.38 2.182.34 2.402.52 2.532a.32.32 0 0 0 .43 0c.1-.822.086-1.654-.04-2.472c1.055.004 2.105.149 3.122.43c0 .1.13.3.17.49c.57 4.557.894 9.14.971 13.731M6.448 6.276l-2.001.11c-1.171.18-.771.52-.59.561c.86.078 1.727.091 2.591.04c.78-.25.72-.48 0-.71" clipRule="evenodd" strokeWidth={0.6} stroke="currentColor"></path></svg>);
}

export function HealthiconsDesktopAppOutline(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 48 48" {...props}><path fill="currentColor" fillRule="evenodd" d="M9.176 8.5C7.422 8.5 6 9.94 6 11.714V31c0 1.775 1.422 3.214 3.176 3.214h10.589v2.143h-4.236V38.5h16.942v-2.143h-4.236v-2.143h10.589C40.578 34.214 42 32.775 42 31V11.714C42 9.94 40.578 8.5 38.824 8.5zm12.706 27.857h4.236v-2.143h-4.236zM8.118 11.714c0-.591.474-1.071 1.058-1.071h29.648c.584 0 1.058.48 1.058 1.071V31c0 .592-.474 1.071-1.058 1.071H9.176c-.584 0-1.058-.48-1.058-1.071zm7.411 1.072h-2.117v2.143h-2.118v2.142h2.118v2.143h2.117v-2.143h2.118V14.93h-2.118zm-3.176 8.571c-.585 0-1.06.48-1.06 1.072v4.285c0 .592.475 1.072 1.06 1.072h4.235c.585 0 1.059-.48 1.059-1.072V22.43c0-.592-.474-1.072-1.059-1.072zm1.059 4.286V23.5h2.117v2.143zm7.412-11.786c0-.592.474-1.071 1.059-1.071h4.235c.585 0 1.059.48 1.059 1.071v4.286c0 .592-.474 1.071-1.06 1.071h-4.234c-.585 0-1.06-.48-1.06-1.071zm2.117 1.072v2.142h2.118V14.93zm-1.058 6.428c-.585 0-1.06.48-1.06 1.072v4.285c0 .592.475 1.072 1.06 1.072h4.235c.585 0 1.059-.48 1.059-1.072V22.43c0-.592-.474-1.072-1.06-1.072zm1.058 4.286V23.5h2.118v2.143zm7.412-11.786c0-.592.474-1.071 1.059-1.071h4.235c.585 0 1.059.48 1.059 1.071v4.286c0 .592-.474 1.071-1.059 1.071h-4.235c-.585 0-1.059-.48-1.059-1.071zm2.118 1.072v2.142h2.117V14.93z" clipRule="evenodd"></path></svg>);
}


export function IconParkOutlineSport(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 48 48" {...props}><g fill="none" stroke="currentColor" strokeWidth={4}><path d="M36 15a5 5 0 1 0 0-10a5 5 0 0 0 0 10Z"></path><path strokeLinecap="round" strokeLinejoin="round" d="m12 16.77l8.003-2.772L31 19.247l-10.997 8.197L31 34.684l-6.992 9.314M35.32 21.643l2.682 1.459L44 17.466M16.849 31.545l-2.97 3.912l-9.875 5.54"></path></g></svg>);
}

export function UilFileContractDollar(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M21.71 20.29L20 18.56v-.31a2.75 2.75 0 0 0-2.75-2.75h-.34l-1.44-1.44a.7.7 0 0 1 .28-.06H19a1 1 0 0 0 0-2h-1.5v-1a1 1 0 0 0-2 0v1a2.74 2.74 0 0 0-1.47.59l-1.32-1.33a1 1 0 0 0-1.42 1.42L13 14.44v.31a2.75 2.75 0 0 0 2.75 2.75h.34l1.44 1.44a.7.7 0 0 1-.28.06H14a1 1 0 0 0 0 2h1.5v1a1 1 0 0 0 2 0v-1a2.74 2.74 0 0 0 1.5-.62l1.32 1.33a1 1 0 0 0 1.42 0a1 1 0 0 0-.03-1.42M10 19H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6v4a1 1 0 0 0 1 1h5a1 1 0 0 0 .92-.62a1 1 0 0 0-.21-1.09l-5-5a1 1 0 0 0-.28-.19h-.09a1.3 1.3 0 0 0-.28-.1H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h5a1 1 0 0 0 0-2m3-14.59L14.59 6H13Z" strokeWidth={0.6} stroke="currentColor"></path></svg>);
}


export function ClarityAirplaneLine(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={36} height={36} viewBox="0 0 36 36" {...props}><path fill="currentColor" d="M35.77 8.16a2.43 2.43 0 0 0-1.9-2L28 4.87a4.5 4.5 0 0 0-3.65.79L7 18.3l-4.86-.2a1.86 1.86 0 0 0-1.23 3.31l5 3.93c.6.73 1 .59 10.93-4.82l.93 9.42a1.36 1.36 0 0 0 .85 1.18a1.4 1.4 0 0 0 .54.1a1.54 1.54 0 0 0 1-.41l2.39-2.18a1.52 1.52 0 0 0 .46-.83l2.19-11.9c3.57-2 6.95-3.88 9.36-5.25a2.43 2.43 0 0 0 1.21-2.49m-2.2.75c-2.5 1.42-6 3.41-9.76 5.47l-.41.23l-2.33 12.67l-1.47 1.34l-1.1-11.3l-1.33.68C10 22 7.61 23.16 6.79 23.52l-4.3-3.41l5.08.22l18-13.06a2.5 2.5 0 0 1 2-.45l5.85 1.26a.43.43 0 0 1 .35.37a.42.42 0 0 1-.2.46" className="clr-i-outline clr-i-outline-path-1"></path><path fill="currentColor" d="m7 12.54l3.56 1l1.64-1.19l-4-1.16l1.8-1.1l5.47-.16l2.3-1.67L10 8.5a1.25 1.25 0 0 0-.7.17L6.67 10.2A1.28 1.28 0 0 0 7 12.54" className="clr-i-outline clr-i-outline-path-2"></path><path fill="none" d="M0 0h36v36H0z"></path></svg>);
}

export function MdiAirportTaxi(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M21.57 12.66c-.14-.4-.52-.66-.97-.66h-7.19c-.46 0-.83.26-.98.66L11 16.77v5.51c0 .38.32.72.7.72h.62c.38 0 .68-.38.68-.76V21h8v1.24c0 .38.31.76.69.76h.61c.38 0 .7-.34.7-.72v-5.51zm-8.16.34h7.19l1.03 3h-9.25zM13 19c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1m8 0c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1M6.66 14.53L7 17l-1.05 1.06l-1.76-3.18L1 13.11l1.06-1.08l2.5.37l3.87-3.87L1 4.62l1.42-1.41l9.19 2.12l3.89-3.89c.56-.585 1.56-.585 2.12 0c.59.59.59 1.56 0 2.12l-3.89 3.89l.82 3.55h-1.14c-.87 0-1.62.5-1.91 1.31l-.03.06l-.91-1.74z" strokeWidth={0.6} stroke="currentColor"></path></svg>);
}


export function HugeiconsTruckDelivery(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeWidth={1.8}><circle cx={17} cy={18} r={2}></circle><circle cx={7} cy={18} r={2}></circle><path strokeLinecap="round" strokeLinejoin="round" d="M5 17.972c-1.097-.054-1.78-.217-2.268-.704s-.65-1.171-.704-2.268M9 18h6m4-.028c1.097-.054 1.78-.217 2.268-.704C22 16.535 22 15.357 22 13v-2h-4.7c-.745 0-1.117 0-1.418-.098a2 2 0 0 1-1.284-1.284C14.5 9.317 14.5 8.945 14.5 8.2c0-1.117 0-1.675-.147-2.127a3 3 0 0 0-1.926-1.926C11.975 4 11.417 4 10.3 4H2m0 4h6m-6 3h4"></path><path strokeLinecap="round" strokeLinejoin="round" d="M14.5 6h1.821c1.456 0 2.183 0 2.775.354c.593.353.938.994 1.628 2.276L22 11"></path></g></svg>);
}



export function MdiHomeElectricityOutline(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M15 9h1V7.5h4V9h1c.55 0 1 .45 1 1v11c0 .55-.45 1-1 1h-6c-.55 0-1-.45-1-1V10c0-.55.45-1 1-1m1 2v3h4v-3zm-4-5.31l-5 4.5V18h5v2H5v-8H2l10-9l2.78 2.5H14v1.67l-.24.1z" strokeWidth={0.6} stroke="currentColor"></path></svg>);
}

export function StripeLogo(props: SVGProps<SVGSVGElement>) {
	return (<svg width="800px" height="800px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" {...props}>
		<circle cx={512} cy={512} r={512} style={{fill: '#635bff'}} />
		<path d="M781.67 515.75c0-38.35-18.58-68.62-54.08-68.62s-57.23 30.26-57.23 68.32c0 45.09 25.47 67.87 62 67.87 17.83 0 31.31-4 41.5-9.74v-30c-10.19 5.09-21.87 8.24-36.7 8.24-14.53 0-27.42-5.09-29.06-22.77h73.26c.01-1.92.31-9.71.31-13.3zm-74-14.23c0-16.93 10.34-24 19.78-24 9.14 0 18.88 7 18.88 24zm-95.14-54.39a42.32 42.32 0 0 0-29.36 11.69l-1.95-9.29h-33v174.68l37.45-7.94.15-42.4c5.39 3.9 13.33 9.44 26.52 9.44 26.82 0 51.24-21.57 51.24-69.06-.12-43.45-24.84-67.12-51.05-67.12zm-9 103.22c-8.84 0-14.08-3.15-17.68-7l-.15-55.58c3.9-4.34 9.29-7.34 17.83-7.34 13.63 0 23.07 15.28 23.07 34.91.01 20.03-9.28 35.01-23.06 35.01zM496.72 438.29l37.6-8.09v-30.41l-37.6 7.94v30.56zm0 11.39h37.6v131.09h-37.6zm-40.3 11.08L454 449.68h-32.34v131.08h37.45v-88.84c8.84-11.54 23.82-9.44 28.46-7.79v-34.45c-4.78-1.8-22.31-5.1-31.15 11.08zm-74.91-43.59L345 425l-.15 120c0 22.17 16.63 38.5 38.8 38.5 12.28 0 21.27-2.25 26.22-4.94v-30.45c-4.79 1.95-28.46 8.84-28.46-13.33v-53.19h28.46v-31.91h-28.51zm-101.27 70.56c0-5.84 4.79-8.09 12.73-8.09a83.56 83.56 0 0 1 37.15 9.59V454a98.8 98.8 0 0 0-37.12-6.87c-30.41 0-50.64 15.88-50.64 42.4 0 41.35 56.93 34.76 56.93 52.58 0 6.89-6 9.14-14.38 9.14-12.43 0-28.32-5.09-40.9-12v35.66a103.85 103.85 0 0 0 40.9 8.54c31.16 0 52.58-15.43 52.58-42.25-.17-44.63-57.25-36.69-57.25-53.47z" style={{fill: '#fff'}} />
	  </svg>);
}

export function IntuitLogo(props: SVGProps<SVGSVGElement>) {
	return (<svg width="800px" height="800px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" {...props}>
		<circle cx={512} cy={512} r={512} style={{fill: '#0077c5'}} />
		<path d="M390.5 486.8h37v102.9h32.9V486.8h36.9v-29.2H390.5v29.2zm218.3 43.4c0 17.6-9.9 35.8-30.7 35.8-21.1 0-24.7-19.5-24.7-35.2v-73.1h-32.9v82.5c0 27 14.3 53.3 48.6 53.3 19.5 0 35.1-11.8 40.9-25h.5v21.2h31.3v-132h-33v72.5zm66.6 59.5h33v-132h-33v132zM444 440.3c5.3 0 10.4-2.1 14.1-5.8 3.7-3.7 5.8-8.8 5.8-14.1 0-5.3-2.1-10.4-5.8-14.1s-8.8-5.8-14.1-5.8c-2.6 0-5.2.5-7.6 1.5-2.4 1-4.6 2.5-6.5 4.3-1.8 1.9-3.3 4.1-4.3 6.5-1 2.4-1.5 5-1.5 7.6 0 11 8.9 19.9 19.9 19.9zm340.9 0c2.6 0 5.2-.5 7.6-1.5 2.4-1 4.6-2.5 6.5-4.3 1.9-1.9 3.3-4.1 4.3-6.5 1-2.4 1.5-5 1.5-7.6 0-3.9-1.2-7.8-3.4-11.1s-5.3-5.8-8.9-7.3c-3.6-1.5-7.6-1.9-11.5-1.1-3.9.8-7.4 2.7-10.2 5.5-2.8 2.8-4.7 6.3-5.4 10.2-.8 3.9-.4 7.9 1.1 11.5 1.5 3.6 4.1 6.7 7.3 8.9 3.3 2.2 7.2 3.3 11.1 3.3zm-53.4 17.3v29.3h37v102.9h32.9v-103h37v-29.2H731.5zM185.7 589.7h33v-132h-33v132zm139.5-135.9c-19.5 0-35.1 11.8-40.9 25h-.5v-21.2h-31.3v132h32.9V517c0-17.6 9.9-35.8 30.8-35.8 21.1 0 24.7 19.6 24.7 35.2v73.2h33v-82.5c-.1-26.9-14.4-53.3-48.7-53.3z" style={{fill: '#fff'}} />
	  </svg>
	  );
}

export function PayPalLogo(props: SVGProps<SVGSVGElement>) {
	return (<svg
		width="800px"
		height="800px"
		viewBox="0 0 48 48"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	  >
		<circle cx={24} cy={24} r={20} fill="#0070BA" />
		<path
		  d="M32.3305 18.0977C32.3082 18.24 32.2828 18.3856 32.2542 18.5351C31.2704 23.5861 27.9046 25.331 23.606 25.331H21.4173C20.8916 25.331 20.4486 25.7127 20.3667 26.2313L19.2461 33.3381L18.9288 35.3527C18.8755 35.693 19.1379 36 19.4815 36H23.3634C23.8231 36 24.2136 35.666 24.286 35.2127L24.3241 35.0154L25.055 30.3772L25.1019 30.1227C25.1735 29.6678 25.5648 29.3338 26.0245 29.3338H26.6051C30.3661 29.3338 33.3103 27.8068 34.1708 23.388C34.5303 21.5421 34.3442 20.0008 33.393 18.9168C33.1051 18.59 32.748 18.3188 32.3305 18.0977Z"
		  fill="white"
		  fillOpacity="0.6"
		/>
		<path
		  d="M31.3009 17.6871C31.1506 17.6434 30.9955 17.6036 30.8364 17.5678C30.6766 17.5328 30.5127 17.5018 30.3441 17.4748C29.754 17.3793 29.1074 17.334 28.4147 17.334H22.5676C22.4237 17.334 22.2869 17.3666 22.1644 17.4254C21.8948 17.5551 21.6944 17.8104 21.6459 18.1229L20.402 26.0013L20.3662 26.2311C20.4481 25.7126 20.8911 25.3308 21.4168 25.3308H23.6055C27.9041 25.3308 31.2699 23.5851 32.2537 18.5349C32.2831 18.3854 32.3078 18.2398 32.33 18.0975C32.0811 17.9655 31.8115 17.8525 31.5212 17.7563C31.4496 17.7324 31.3757 17.7094 31.3009 17.6871Z"
		  fill="white"
		  fillOpacity="0.8"
		/>
		<path
		  d="M21.6461 18.1231C21.6946 17.8105 21.895 17.5552 22.1646 17.4264C22.2879 17.3675 22.4239 17.3349 22.5678 17.3349H28.4149C29.1077 17.3349 29.7542 17.3803 30.3444 17.4757C30.513 17.5027 30.6768 17.5338 30.8367 17.5687C30.9957 17.6045 31.1508 17.6443 31.3011 17.688C31.3759 17.7103 31.4498 17.7334 31.5222 17.7564C31.8125 17.8527 32.0821 17.9664 32.331 18.0976C32.6237 16.231 32.3287 14.9601 31.3194 13.8093C30.2068 12.5424 28.1986 12 25.629 12H18.169C17.6441 12 17.1963 12.3817 17.1152 12.9011L14.0079 32.5969C13.9467 32.9866 14.2473 33.3381 14.6402 33.3381H19.2458L20.4022 26.0014L21.6461 18.1231Z"
		  fill="white"
		/>
	  </svg>
	  
	  );
}

export function XeroLogo(props: SVGProps<SVGSVGElement>) {
	return (<svg
		width="800px"
		height="800px"
		viewBox="0 0 256 256"
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		preserveAspectRatio="xMidYMid"
		{...props}
	  >
		<g>
		  <path
			d="M128.00285,256 C198.693118,256 256,198.688775 256,128 C256,57.2998444 198.698818,0 128.00285,0 C57.3068822,0 0,57.2998444 0,128 C0,198.688775 57.3068822,256 128.00285,256"
			fill="#1FC0E7"
		  ></path>
		  <path
			d="M62.3672889,127.967763 L84.1671111,106.065541 C84.8896,105.337363 85.2935111,104.358874 85.2935111,103.323496 C85.2935111,101.161719 83.5413333,99.4095407 81.3852444,99.4095407 C80.3328,99.4095407 79.3486222,99.8191407 78.6090667,100.575763 L56.8206222,122.381274 L34.9468444,100.535941 C34.2072889,99.807763 33.2288,99.4095407 32.1877333,99.4095407 C30.0259556,99.4095407 28.2794667,101.161719 28.2794667,103.317807 C28.2794667,104.370252 28.7004444,105.365807 29.4513778,106.105363 L51.2512,127.93363 L29.4627556,149.778963 C28.7004444,150.541274 28.2794667,151.531141 28.2794667,152.583585 C28.2794667,154.745363 30.0316444,156.497541 32.1877333,156.497541 C33.2288,156.497541 34.2072889,156.099319 34.9468444,155.359763 L56.7921778,133.503052 L78.5521778,155.27443 C79.3258667,156.070874 80.3157333,156.497541 81.3852444,156.497541 C83.5356444,156.497541 85.2878222,154.745363 85.2878222,152.583585 C85.2878222,151.542519 84.8896,150.56403 84.1500444,149.824474 L62.3616,127.945007 L62.3672889,127.967763 Z M191.965867,127.962074 C191.965867,131.887407 195.151644,135.073185 199.076978,135.073185 C202.979556,135.073185 206.165333,131.887407 206.165333,127.962074 C206.165333,124.036741 202.979556,120.850963 199.071289,120.850963 C195.163022,120.850963 191.982933,124.036741 191.982933,127.962074 L191.965867,127.962074 Z M178.511644,127.962074 C178.511644,116.612741 187.727644,107.368296 199.071289,107.368296 C210.392178,107.368296 219.625244,116.612741 219.625244,127.962074 C219.625244,139.311407 210.397867,148.555852 199.071289,148.555852 C187.733333,148.555852 178.511644,139.322785 178.511644,127.962074 L178.511644,127.962074 Z M170.422044,127.962074 C170.422044,143.777185 183.278933,156.65683 199.071289,156.65683 C214.863644,156.65683 227.720533,143.788563 227.720533,127.967763 C227.720533,112.152652 214.863644,99.2730074 199.071289,99.2730074 C183.273244,99.2730074 170.422044,112.146963 170.422044,127.967763 L170.422044,127.962074 Z M168.391111,99.7622519 L167.196444,99.7622519 C163.584,99.7622519 160.1024,100.90003 157.195378,103.147141 C156.797156,101.406341 155.227022,100.075141 153.361067,100.075141 C151.216356,100.075141 149.492622,101.810252 149.492622,103.966341 L149.504,152.293452 C149.504,154.438163 151.267556,156.184652 153.400889,156.184652 C155.551289,156.184652 157.303467,154.438163 157.309156,152.282074 L157.309156,122.563319 C157.309156,112.664652 158.219378,108.659674 166.684444,107.601541 C167.480889,107.50483 168.322844,107.521896 168.334222,107.521896 C170.643911,107.436563 172.293689,105.837985 172.293689,103.681896 C172.293689,101.520119 170.530133,99.7679407 168.368356,99.7679407 L168.391111,99.7622519 Z M93.3774222,123.245985 C93.3774222,123.132207 93.3888,123.01843 93.3944889,122.91603 C95.6586667,113.927585 103.7824,107.288652 113.447822,107.288652 C123.232711,107.288652 131.424711,114.081185 133.586489,123.228919 L93.3717333,123.228919 L93.3774222,123.245985 Z M141.579378,122.50643 C139.895467,114.524919 135.532089,107.96563 128.893156,103.755852 C119.176533,97.5777185 106.353778,97.9190519 96.9784889,104.609185 C89.3212444,110.053452 84.9009778,118.97363 84.9009778,128.161185 C84.9009778,130.465185 85.1854222,132.791941 85.7543111,135.084563 C88.6442667,146.462341 98.4177778,155.086696 110.068622,156.514607 C113.527467,156.935585 116.895289,156.742163 120.365511,155.831941 C123.369244,155.092385 126.264889,153.886341 128.932978,152.168296 C131.703467,150.387674 134.018844,148.032474 136.271644,145.216474 C136.305778,145.159585 136.351289,145.119763 136.3968,145.062874 C137.955556,143.128652 137.665422,140.363852 135.958756,139.055407 C134.513778,137.946074 132.090311,137.496652 130.190222,139.942874 C129.780622,140.534519 129.319822,141.137541 128.824889,141.734874 C127.305956,143.413096 125.422933,145.03443 123.170133,146.297363 C120.291556,147.833363 117.026133,148.703763 113.555911,148.726519 C102.189511,148.595674 96.1137778,140.648296 93.9463111,134.982163 C93.5708444,133.918341 93.2807111,132.820385 93.0759111,131.682607 L93.0190222,131.085274 L133.808356,131.085274 C139.394844,130.960119 142.398578,127.006341 141.568,122.495052 L141.579378,122.50643 Z"
			fill="#FFFFFF"
		  ></path>
		</g>
	  </svg>
	  
	  );
}

export function TablerPlugConnected(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height}  viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4} d="m7 12l5 5l-1.5 1.5a3.536 3.536 0 1 1-5-5zm10 0l-5-5l1.5-1.5a3.536 3.536 0 1 1 5 5zM3 21l2.5-2.5m13-13L21 3m-11 8l-2 2m5 1l-2 2"></path></svg>);
}

export function MapprLogoM(props: SVGProps<SVGSVGElement>) {
	return (  <svg
		id="Layer_2"
		data-name="Layer 2"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 108.89 73.35"
	  >
		<defs>
		  <style
			dangerouslySetInnerHTML={{
			  __html:
				"\n      .cls-1 {\n        fill: #ff6333;\n        stroke-width: 0px;\n      }\n    "
			}}
		  />
		</defs>
		<g id="Layer_1-2" data-name="Layer 1">
		  <polygon
			className="cls-1"
			points="108.89 10.48 108.89 52.39 72.59 73.35 72.59 52.39 54.44 62.87 36.29 52.39 36.29 73.35 0 52.39 0 10.48 18.15 20.96 18.15 0 54.44 20.96 90.74 0 90.74 20.96 108.89 10.48"
		  />
		</g>
	  </svg>

	);
}

export function MapprLogoMT(props: SVGProps<SVGSVGElement>) {
	return (   <svg
		id="Layer_2"
		data-name="Layer 2"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 100.21 108.89"
		height={props.height}
		width={props.width}
		className={props.className}
	  >
		<defs>
		  <style
			dangerouslySetInnerHTML={{
			  __html:
				"\n      .cls-1 {\n        fill: #D6714C;\n        stroke-width: 0px;\n      }\n    "
			}}
		  />
		</defs>
		<g id="Layer_1-2" data-name="Layer 1">
		  <g>
			<path
			  className="cls-1"
			  d="M53.71.72c-1.64-.96-3.66-.96-5.3,0l-25.19,14.74,49.26,28.78v58.27l25.13-14.7c1.61-.94,2.6-2.66,2.6-4.53V27.93L53.71.72Z"
			/>
			<path
			  className="cls-1"
			  d="M23.27,30.91L0,44.28l36.57,21.36v43.25l23.22-13.35c1.19-.7,1.93-1.98,1.93-3.36v-41.08L27.2,30.91c-1.21-.71-2.72-.71-3.93,0Z"
			/>
			<polygon
			  className="cls-1"
			  points="25.5 100.82 25.5 71.64 .56 86.23 25.5 100.82"
			/>
		  </g>
		</g>
	  </svg>
	);
}



export function HugeiconsPuzzle(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} className={props.className} viewBox="0 0 24 24" {...props}><path fill="currentColor" stroke="currentColor" strokeLinejoin="round" strokeWidth={props.stroke} d="M12.828 6.001a3 3 0 1 0-5.658 0c-2.285.008-3.504.09-4.292.878S2.008 8.886 2 11.17a3 3 0 1 1 0 5.66c.008 2.284.09 3.503.878 4.291s2.007.87 4.291.878a3 3 0 1 1 5.66 0c2.284-.008 3.503-.09 4.291-.878s.87-2.007.878-4.292a3 3 0 1 0 0-5.658c-.008-2.285-.09-3.504-.878-4.292c-.788-.789-2.007-.87-4.292-.878Z" opacity={0.5}></path></svg>);
}


export function SolarWalletMoneyLinear(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeWidth={props.stroke}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={props.stroke} d="M6 10h4"></path><path strokeWidth={props.stroke} d="M20.833 11h-2.602C16.446 11 15 12.343 15 14s1.447 3 3.23 3h2.603c.084 0 .125 0 .16-.002c.54-.033.97-.432 1.005-.933c.002-.032.002-.071.002-.148v-3.834c0-.077 0-.116-.002-.148c-.036-.501-.465-.9-1.005-.933c-.035-.002-.076-.002-.16-.002Z"></path><path strokeWidth={props.stroke} d="M20.965 11c-.078-1.872-.328-3.02-1.137-3.828C18.657 6 16.771 6 13 6h-3C6.229 6 4.343 6 3.172 7.172S2 10.229 2 14s0 5.657 1.172 6.828S6.229 22 10 22h3c3.771 0 5.657 0 6.828-1.172c.809-.808 1.06-1.956 1.137-3.828"></path><path strokeLinecap="round" strokeWidth={props.stroke} d="m6 6l3.735-2.477a3.24 3.24 0 0 1 3.53 0L17 6"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M17.991 14h.01"></path></g></svg>);
}


export function HugeiconsCsv01(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={1.8}><path d="M7.5 17.22C7.445 16.03 6.622 16 5.505 16c-1.72 0-2.005.406-2.005 2v2c0 1.594.285 2 2.005 2c1.117 0 1.94-.03 1.995-1.22m13-4.78l-1.777 4.695c-.33.87-.494 1.305-.755 1.305c-.26 0-.426-.435-.755-1.305L15.436 16m-2.56 0h-1.18c-.473 0-.709 0-.895.076c-.634.26-.625.869-.625 1.424s-.009 1.165.625 1.424c.186.076.422.076.894.076s.708 0 .894.076c.634.26.625.869.625 1.424s.009 1.165-.625 1.424c-.186.076-.422.076-.894.076H10.41"></path><path strokeLinejoin="round" d="M20 13v-2.343c0-.818 0-1.226-.152-1.594c-.152-.367-.441-.657-1.02-1.235l-4.736-4.736c-.499-.499-.748-.748-1.058-.896a2 2 0 0 0-.197-.082C12.514 2 12.161 2 11.456 2c-3.245 0-4.868 0-5.967.886a4 4 0 0 0-.603.603C4 4.59 4 6.211 4 9.456V13m9-10.5V3c0 2.828 0 4.243.879 5.121C14.757 9 16.172 9 19 9h.5"></path></g></svg>);
}

export function HugeiconsUpload03(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}><path d="M14 21.5h-4c-3.288 0-4.931 0-6.038-.908a4 4 0 0 1-.554-.554C2.5 18.93 2.5 17.288 2.5 14c0-3.287 0-4.931.908-6.038a4 4 0 0 1 .554-.554C5.07 6.5 6.712 6.5 10 6.5h4c3.287 0 4.931 0 6.038.908q.304.25.554.554c.908 1.107.908 2.75.908 6.038s0 4.931-.908 6.038a4 4 0 0 1-.554.554c-1.107.908-2.75.908-6.038.908"></path><path d="M2.5 14.5v-4c0-3.771 0-5.657 1.172-6.828S6.729 2.5 10.5 2.5h3c3.771 0 5.657 0 6.828 1.172S21.5 6.729 21.5 10.5v4"></path><path d="M15 13.5s-2.21-3-3-3s-3 3-3 3m3-2.5v6.5"></path></g></svg>);
}


export function MynauiGridOne(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.4 21h5.2m-5.2 0c-2.24 0-3.36 0-4.216-.436a4 4 0 0 1-1.748-1.748C3 17.96 3 16.84 3 14.6M9.4 21V3M3 14.6V9.4m0 5.2h18m0 0V9.4m0 5.2c0 2.24 0 3.36-.436 4.216a4 4 0 0 1-1.748 1.748C17.96 21 16.84 21 14.6 21m0 0V3m0 0H9.4m5.2 0c2.24 0 3.36 0 4.216.436a4 4 0 0 1 1.748 1.748C21 6.04 21 7.16 21 9.4m0 0H3M9.4 3c-2.24 0-3.36 0-4.216.436a4 4 0 0 0-1.748 1.748C3 6.04 3 7.16 3 9.4"></path></svg>);
}

export function TellerLogo(props: React.ComponentProps<typeof Image>) {
	return (
	  <Image
		src={tellerLogo}
		alt="Teller Logo"
		width={80}
		height={80}
	
	  />
	);
  }


export function StreamlineUltimatePowerPlugDisconnected(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.356 18.758a8.06 8.06 0 0 1-8.121-1.993a8.06 8.06 0 0 1-2.038-7.972m13.118 1.978l4.153-4.153m-9.238-.932l4.153-4.154M1.631 22.369l5.604-5.603M1.318 1.318l21.363 21.364M6.329 6.266l3.74-3.74l11.405 11.405l-3.74 3.74"></path></svg>);
}


export function FluentBuildingBank28Regular(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 28 28" {...props}><path fill="currentColor" d="M14 9a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3m.89-6.705a1.5 1.5 0 0 0-1.78 0L3.61 9.3c-1.164.859-.557 2.707.89 2.707H5v7.242a3.25 3.25 0 0 0-2 3.001v1.5c0 .414.336.75.75.75h20.5a.75.75 0 0 0 .75-.75v-1.5a3.25 3.25 0 0 0-2-3v-7.243h.499c1.448 0 2.055-1.848.89-2.707zM6.5 19v-6.993H9V19zm15-6.993V19H19v-6.993zm-4 0V19h-2.75v-6.993zm-4.25 0V19H10.5v-6.993zm-8.75-1.5L14 3.502l9.499 7.005zm0 11.743c0-.966.784-1.75 1.75-1.75h15.5c.966 0 1.75.784 1.75 1.75V23h-19z" strokeWidth={0.6} stroke="currentColor"></path></svg>);
}


export function FluentBuildingBankLink28Regular(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 28 28" {...props}><path fill="currentColor" d="M14.001 8.999a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3m.89-6.706a1.5 1.5 0 0 0-1.78 0L3.613 9.298c-1.165.86-.558 2.708.89 2.708h.499v7.243a3.25 3.25 0 0 0-2 3v1.5c0 .415.336.75.75.75h9.582a4.7 4.7 0 0 1-.326-1.5H4.502v-.75c0-.966.783-1.75 1.75-1.75h7.315a4.8 4.8 0 0 1 1.268-1.5h-.084v-6.993h2.75v6q.124-.007.25-.007H19v-5.993h2.5v5.993H23v-5.993h.498c1.448 0 2.055-1.848.89-2.708zm-8.39 16.706v-6.993h2.5v6.993zm6.75-6.993v6.993h-2.75v-6.993zm-8.748-1.5L14 3.5l9.498 7.006zM17.75 20.5a2.25 2.25 0 0 0 0 4.5h.5a.75.75 0 0 1 0 1.5h-.5a3.75 3.75 0 0 1 0-7.5h.5a.75.75 0 0 1 0 1.5zM17 22.75a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75M23.25 25a2.25 2.25 0 0 0 0-4.5h-.5a.75.75 0 0 1 0-1.5h.5a3.75 3.75 0 0 1 0 7.5h-.5a.75.75 0 0 1 0-1.5z" strokeWidth={0.6} stroke="currentColor"></path></svg>);
}


export function EmojioneMonotoneDollarBanknote(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={64} height={64} viewBox="0 0 64 64" {...props}><path fill="currentColor" d="M2 10v44h60V10zm22.727 29.333H9.272V17.334h15.454v21.999zm12.727 5.502H26.545V12.75h10.909zm1.818-10.797a7.17 7.17 0 0 0 4.546 1.629c4.017 0 7.271-3.284 7.271-7.334S47.834 21 43.818 21a7.17 7.17 0 0 0-4.546 1.629v-5.295h15.454v21.999H39.272zm0 8.045h18.182V14.584H39.272v-2.75h20.909v33H39.272zM3.818 11.834h20.908v2.75H6.545v27.499h18.182v2.751H3.818z" strokeWidth={1.5} stroke="currentColor"></path><path fill="currentColor" d="M17.454 32.917a1.83 1.83 0 0 1-1.818-1.834h-1.817a3.65 3.65 0 0 0 2.727 3.536v1.048h1.818v-1.048a3.655 3.655 0 0 0 2.727-3.536c0-2.021-1.631-3.666-3.636-3.666a1.83 1.83 0 0 1-1.818-1.833c0-1.013.816-1.834 1.818-1.834s1.818.821 1.818 1.834h1.817a3.65 3.65 0 0 0-2.727-3.536V21h-1.818v1.048a3.655 3.655 0 0 0-2.727 3.536c0 2.021 1.631 3.666 3.636 3.666c1.003 0 1.818.822 1.818 1.833a1.827 1.827 0 0 1-1.818 1.834" strokeWidth={1.5} stroke="currentColor"></path></svg>);
}


export function ArcticonsEverydollar(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 48 48" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m43.5 14.957l-14.696-4.004c-9.938.518-16.862 2.214-24.304 9.373l15.214 4.852C24 18.913 33.609 14.486 43.5 14.957" strokeWidth={2}></path><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M43.5 16.244c-10.472.283-18.558 7.662-23.362 14.868L7.185 26.355c.707-2.677 2.846-4.265 2.846-4.265" strokeWidth={2}></path><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M43.123 17.688c-6.547.283-19.688 12.624-22.42 19.36c0 0-6.223-2.88-10.645-4.334c-.016-3.251 1.41-4.786 1.41-4.786" strokeWidth={2}></path><ellipse cx={22.87} cy={14.674} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" rx={4.899} ry={1.413} strokeWidth={2}></ellipse></svg>);
}


export function HugeiconsMoneyExchange02(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}><path d="M14.5 10.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0"></path><path d="M22 10.5V5.427c0-.568-.324-1.082-.867-1.25C20.19 3.883 18.479 3.5 16 3.5c-4.58 0-5.803 1.677-12.122.424C2.921 3.734 2 4.445 2 5.42v10.017c0 .688.473 1.293 1.145 1.441c5.567 1.228 7.412.32 10.355-.093"></path><path d="M2 7.5c1.951 0 3.705-1.595 3.929-3.246M18.5 4c0 2.04 1.765 3.969 3.5 3.969M6 16.996a4 4 0 0 0-4-4M16 15.5a1 1 0 0 1 1-1h5l-1.5-2m1.5 5a1 1 0 0 1-1 1h-5l1.5 2"></path></g></svg>);
}


export function LetsIconsCreditCardDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" fillOpacity={0.25} d="M3 10c0-1.886 0-2.828.586-3.414S5.114 6 7 6h10c1.886 0 2.828 0 3.414.586S21 8.114 21 10v4c0 1.886 0 2.828-.586 3.414S18.886 18 17 18H7c-1.886 0-2.828 0-3.414-.586S3 15.886 3 14z"></path><circle cx={6} cy={15} r={1} fill="currentColor"></circle><path fill="currentColor" d="M3 9h18v2H3z"></path></svg>);
}


export function HugeiconsCreditCard(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth={1.8}><path strokeLinecap="round" d="M2 12c0-3.537 0-5.306 1.053-6.487q.253-.284.554-.522C4.862 4 6.741 4 10.5 4h3c3.759 0 5.638 0 6.892.99q.302.24.555.523C22 6.693 22 8.463 22 12s0 5.306-1.053 6.487a4.4 4.4 0 0 1-.555.522C19.138 20 17.26 20 13.5 20h-3c-3.759 0-5.638 0-6.893-.99a4.4 4.4 0 0 1-.554-.523C2 17.307 2 15.537 2 12"></path><path strokeLinecap="round" strokeMiterlimit={10} d="M10 16h1.5m3 0H18"></path><path d="M2 9h20"></path></g></svg>);
}


export function SolarWalletMoneyBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M4.892 9.614c0-.402.323-.728.722-.728H9.47c.4 0 .723.326.723.728a.726.726 0 0 1-.723.729H5.614a.726.726 0 0 1-.722-.729"></path><path fill="currentColor" fillRule="evenodd" d="M21.188 10.004q-.094-.005-.2-.004h-2.773C15.944 10 14 11.736 14 14s1.944 4 4.215 4h2.773q.106.001.2-.004c.923-.056 1.739-.757 1.808-1.737c.004-.064.004-.133.004-.197v-4.124c0-.064 0-.133-.004-.197c-.069-.98-.885-1.68-1.808-1.737m-3.217 5.063c.584 0 1.058-.478 1.058-1.067c0-.59-.474-1.067-1.058-1.067s-1.06.478-1.06 1.067c0 .59.475 1.067 1.06 1.067" clipRule="evenodd"></path><path fill="currentColor" d="M21.14 10.002c0-1.181-.044-2.448-.798-3.355a4 4 0 0 0-.233-.256c-.749-.748-1.698-1.08-2.87-1.238C16.099 5 14.644 5 12.806 5h-2.112C8.856 5 7.4 5 6.26 5.153c-1.172.158-2.121.49-2.87 1.238c-.748.749-1.08 1.698-1.238 2.87C2 10.401 2 11.856 2 13.694v.112c0 1.838 0 3.294.153 4.433c.158 1.172.49 2.121 1.238 2.87c.749.748 1.698 1.08 2.87 1.238c1.14.153 2.595.153 4.433.153h2.112c1.838 0 3.294 0 4.433-.153c1.172-.158 2.121-.49 2.87-1.238q.305-.308.526-.66c.45-.72.504-1.602.504-2.45l-.15.001h-2.774C15.944 18 14 16.264 14 14s1.944-4 4.215-4h2.773q.079 0 .151.002" opacity={0.5}></path><path fill="currentColor" d="M10.101 2.572L8 3.992l-1.733 1.16C7.405 5 8.859 5 10.694 5h2.112c1.838 0 3.294 0 4.433.153q.344.045.662.114L16 4l-2.113-1.428a3.42 3.42 0 0 0-3.786 0"></path></svg>);
}


export function IcTwotoneEnergySavingsLeaf(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M7.1 7.01C5.74 8.32 5 10.1 5 12c0 3.86 3.14 7 7 7c1.87 0 3.63-.73 4.95-2.05A6.96 6.96 0 0 0 19 12V5h-7c-1.84 0-3.58.71-4.9 2.01m6.78.11c.14.14.16.36.04.52l-2.44 3.33l4.05.4c.44.04.63.59.3.89l-5.16 4.63c-.16.15-.41.14-.56-.01a.4.4 0 0 1-.04-.52l2.44-3.33l-4.05-.4a.514.514 0 0 1-.3-.89l5.16-4.63c.16-.15.41-.14.56.01" opacity={0.3}></path><path fill="currentColor" d="M12 3c-4.8 0-9 3.86-9 9c0 2.12.74 4.07 1.97 5.61L3 19.59L4.41 21l1.97-1.97A9 9 0 0 0 12 21c2.3 0 4.61-.88 6.36-2.64A8.95 8.95 0 0 0 21 12V3zm7 9c0 1.87-.73 3.63-2.05 4.95A6.96 6.96 0 0 1 12 19c-3.86 0-7-3.14-7-7c0-1.9.74-3.68 2.1-4.99A6.94 6.94 0 0 1 12 5h7z"></path><path fill="currentColor" d="m8.46 12.63l4.05.4l-2.44 3.33c-.11.16-.1.38.04.52c.15.15.4.16.56.01l5.16-4.63c.33-.3.15-.85-.3-.89l-4.05-.4l2.44-3.33c.11-.16.1-.38-.04-.52a.405.405 0 0 0-.56-.01l-5.16 4.63c-.32.3-.14.85.3.89"></path></svg>);
}


export function MaterialSymbolsLightNestFoundSavingsRounded(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M9.423 19H5.615q-.69 0-1.153-.462T4 17.384V4.616q0-.691.463-1.153T5.616 3h12.769q.69 0 1.153.463T20 4.616v12.769q0 .69-.462 1.153T18.384 19h-3.807l-2.012 2.011q-.242.243-.565.243t-.566-.243zM12 15.5q1.939 0 3.22-1.356T16.5 11V7.308q0-.348-.23-.578t-.578-.23H12q-1.814 0-3.157 1.28T7.5 11q0 .673.241 1.367q.242.694.694 1.385l-.689.67q-.165.164-.165.353t.165.354t.351.153q.186-.013.357-.172l.682-.62q.62.483 1.38.747q.761.263 1.484.263m.904-5.529q.165.165.165.366t-.165.367l-2.663 2.663q-.166.166-.357.156q-.192-.01-.357-.156q-.16-.165-.17-.356q-.009-.192.15-.351l2.69-2.689q.165-.165.353-.165t.354.165"></path></svg>);
}


export function NotoMoneyBag(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={128} height={128} viewBox="0 0 128 128" {...props}><path fill="#c16503" d="M93.46 39.45c6.71-1.49 15.45-8.15 16.78-11.43c.78-1.92-3.11-4.92-4.15-6.13c-2.38-2.76-1.42-4.12-.5-7.41c1.05-3.74-1.44-7.87-4.97-9.49s-7.75-1.11-11.3.47s-6.58 4.12-9.55 6.62c-2.17-1.37-5.63-7.42-11.23-3.49c-3.87 2.71-4.22 8.61-3.72 13.32c1.17 10.87 3.85 16.51 8.9 18.03c6.38 1.92 13.44.91 19.74-.49"></path><path fill="#e27c10" d="M104.36 8.18c-.85 14.65-15.14 24.37-21.92 28.65l4.4 3.78s2.79.06 6.61-1.16c6.55-2.08 16.12-7.96 16.78-11.43c.97-5.05-4.21-3.95-5.38-7.94c-.61-2.11 2.97-6.1-.49-11.9m-24.58 3.91s-2.55-2.61-4.44-3.8c-.94 1.77-1.61 3.69-1.94 5.67c-.59 3.48 0 8.42 1.39 12.1c.22.57 1.04.48 1.13-.12c1.2-7.91 3.86-13.85 3.86-13.85"></path><path fill="#c16503" d="M61.96 38.16S30.77 41.53 16.7 68.61s-2.11 43.5 10.55 49.48s44.56 8.09 65.31 3.17s25.94-15.12 24.97-24.97c-1.41-14.38-14.77-23.22-14.77-23.22s.53-17.76-13.25-29.29c-12.23-10.24-27.55-5.62-27.55-5.62"></path><path fill="#fff" d="M74.76 83.73c-6.69-8.44-14.59-9.57-17.12-12.6c-1.38-1.65-2.19-3.32-1.88-5.39c.33-2.2 2.88-3.72 4.86-4.09c2.31-.44 7.82-.21 12.45 4.2c1.1 1.04.7 2.66.67 4.11c-.08 3.11 4.37 6.13 7.97 3.53c3.61-2.61.84-8.42-1.49-11.24c-1.76-2.13-8.14-6.82-16.07-7.56c-2.23-.21-11.2-1.54-16.38 8.31c-1.49 2.83-2.04 9.67 5.76 15.45c1.63 1.21 10.09 5.51 12.44 8.3c4.07 4.83 1.28 9.08-1.9 9.64c-8.67 1.52-13.58-3.17-14.49-5.74c-.65-1.83.03-3.81-.81-5.53c-.86-1.77-2.62-2.47-4.48-1.88c-6.1 1.94-4.16 8.61-1.46 12.28c2.89 3.93 6.44 6.3 10.43 7.6c14.89 4.85 22.05-2.81 23.3-8.42c.92-4.11.82-7.67-1.8-10.97"></path><path fill="none" stroke="#fff" strokeMiterlimit={10} strokeWidth={5} d="M71.16 48.99c-12.67 27.06-14.85 61.23-14.85 61.23"></path><path fill="#f7f4f3" d="M81.67 31.96c8.44 2.75 10.31 10.38 9.7 12.46c-.73 2.44-10.08-7.06-23.98-6.49c-4.86.2-3.45-2.78-1.2-4.5c2.97-2.27 7.96-3.91 15.48-1.47"></path><path fill="#fff" d="M81.67 31.96c8.44 2.75 10.31 10.38 9.7 12.46c-.73 2.44-10.08-7.06-23.98-6.49c-4.86.2-3.45-2.78-1.2-4.5c2.97-2.27 7.96-3.91 15.48-1.47"></path><path fill="#e27c10" d="M96.49 58.86c1.06-.73 4.62.53 5.62 7.5c.49 3.41.64 6.71.64 6.71s-4.2-3.77-5.59-6.42c-1.75-3.35-2.43-6.59-.67-7.79"></path></svg>);
}

export function StreamlinePlumpMoneyCashBill1(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 48 48" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4.3}><path d="M35 42.342a5.2 5.2 0 0 1-1.896.456C30.962 42.906 27.962 43 24 43s-6.962-.095-9.104-.203A5.2 5.2 0 0 1 13 42.342m26.5-5.463a5.2 5.2 0 0 1-2.554.818c-2.788.152-7.035.302-12.946.302s-10.158-.15-12.946-.302a5.2 5.2 0 0 1-2.554-.818M3.398 28.21c.246 2.495 2.258 4.288 4.763 4.425C11.382 32.812 16.562 33 24 33s12.618-.188 15.84-.365c2.504-.137 4.516-1.93 4.762-4.425c.212-2.149.398-5.183.398-9.21s-.186-7.061-.398-9.21c-.246-2.496-2.258-4.288-4.763-4.425C36.618 5.188 31.438 5 24 5s-12.618.188-15.84.365c-2.504.137-4.516 1.93-4.762 4.425C3.186 11.94 3 14.973 3 19s.186 7.061.398 9.21"></path><path d="M28 14.51s-1.6-1.225-4-1.225c-2 0-4 1.225-4 2.857c0 4.082 8 1.633 8 5.715c0 1.632-2 2.857-4 2.857c-2.4 0-4-1.225-4-1.225m4-10.203V11m0 16v-2.285M37 19h-1m-24 0h-1"></path></g></svg>);
}


export function MageCalendar2(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 4.625H7a4 4 0 0 0-4 4v8.75a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4v-8.75a4 4 0 0 0-4-4m-14 6h18m-4-8v4m-10-4v4m.375 7.515h1.028m7.194 0h1.028m-5.139 0h1.028m-5.139 3.084h1.028m7.194 0h1.028m-5.139 0h1.028"></path></svg>);
}

export function MdiDollar(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M7 15h2c0 1.08 1.37 2 3 2s3-.92 3-2c0-1.1-1.04-1.5-3.24-2.03C9.64 12.44 7 11.78 7 9c0-1.79 1.47-3.31 3.5-3.82V3h3v2.18C15.53 5.69 17 7.21 17 9h-2c0-1.08-1.37-2-3-2s-3 .92-3 2c0 1.1 1.04 1.5 3.24 2.03C14.36 11.56 17 12.22 17 15c0 1.79-1.47 3.31-3.5 3.82V21h-3v-2.18C8.47 18.31 7 16.79 7 15"></path></svg>);
}


export function SolarInboxInBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12" opacity={0.5}></path><path fill="currentColor" d="M3.465 20.536C4.929 22 7.286 22 12 22s7.072 0 8.536-1.465C21.893 19.179 21.993 17.056 22 13h-3.16c-.905 0-1.358 0-1.755.183c-.398.183-.693.527-1.282 1.214l-.605.706c-.59.687-.884 1.031-1.282 1.214s-.85.183-1.755.183h-.321c-.905 0-1.358 0-1.756-.183s-.692-.527-1.281-1.214l-.606-.706c-.589-.687-.883-1.031-1.281-1.214S6.066 13 5.16 13H2c.007 4.055.107 6.179 1.465 7.535m9.065-9.205a.75.75 0 0 1-1.06 0l-3.3-3.3a.75.75 0 1 1 1.06-1.06l2.02 2.02V2h1.5v6.99l2.02-2.02a.75.75 0 1 1 1.06 1.06z"></path></svg>);
}


export function HeroiconsWallet(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"></path></svg>);
}



export function SolarHomeSmileBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M2 12.204c0-2.289 0-3.433.52-4.381c.518-.949 1.467-1.537 3.364-2.715l2-1.241C9.889 2.622 10.892 2 12 2s2.11.622 4.116 1.867l2 1.241c1.897 1.178 2.846 1.766 3.365 2.715S22 9.915 22 12.203v1.522c0 3.9 0 5.851-1.172 7.063S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.212S2 17.626 2 13.725z" opacity={0.5}></path><path fill="currentColor" d="M9.447 15.398a.75.75 0 0 0-.894 1.205A5.77 5.77 0 0 0 12 17.75a5.77 5.77 0 0 0 3.447-1.147a.75.75 0 0 0-.894-1.206A4.27 4.27 0 0 1 12 16.25a4.27 4.27 0 0 1-2.553-.852"></path></svg>);
}


export function MingcutePlugin2Fill(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M2 9a3 3 0 0 1 3-3h2.853c.297 0 .48-.309.366-.583A2.5 2.5 0 0 1 8.083 5c-.331-1.487.792-3 2.417-3c1.626 0 2.748 1.513 2.417 3a2.5 2.5 0 0 1-.136.417c-.115.274.069.583.366.583H15a3 3 0 0 1 3 3v1.853c0 .297.308.48.583.366c.135-.056.273-.104.417-.136c1.487-.331 3 .791 3 2.417s-1.513 2.748-3 2.417a2.5 2.5 0 0 1-.417-.136c-.274-.115-.583.069-.583.366V19a3 3 0 0 1-3 3h-1.893c-.288 0-.473-.291-.39-.566q.063-.21.085-.434a2.31 2.31 0 1 0-4.604 0q.021.224.086.434c.082.275-.103.566-.39.566H5a3 3 0 0 1-3-3v-2.893c0-.288.291-.473.566-.39q.21.063.434.085a2.31 2.31 0 1 0 0-4.604q-.224.021-.434.086c-.275.082-.566-.103-.566-.39z" opacity={0.5}></path></g></svg>);
}


export function SolarPieChart2BoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M6.222 4.601a9.5 9.5 0 0 1 1.395-.771c1.372-.615 2.058-.922 2.97-.33c.913.59.913 1.56.913 3.5v1.5c0 1.886 0 2.828.586 3.414s1.528.586 3.414.586H17c1.94 0 2.91 0 3.5.912c.592.913.285 1.599-.33 2.97a9.5 9.5 0 0 1-10.523 5.435A9.5 9.5 0 0 1 6.222 4.601" opacity={0.5}></path><path fill="currentColor" d="M21.446 7.069a8.03 8.03 0 0 0-4.515-4.515C15.389 1.947 14 3.344 14 5v4a1 1 0 0 0 1 1h4c1.657 0 3.053-1.39 2.446-2.931"></path></svg>);
}


export function HeroiconsWallet16Solid(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" {...props}><path fill="currentColor" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v.401a3 3 0 0 0-1.5-.401h-9c-.546 0-1.059.146-1.5.401zM3.5 5A1.5 1.5 0 0 0 2 6.5v.401A3 3 0 0 1 3.5 6.5h9c.546 0 1.059.146 1.5.401V6.5A1.5 1.5 0 0 0 12.5 5zM8 10a2 2 0 0 0 1.938-1.505c.068-.268.286-.495.562-.495h2A1.5 1.5 0 0 1 14 9.5v3a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 12.5v-3A1.5 1.5 0 0 1 3.5 8h2c.276 0 .494.227.562.495A2 2 0 0 0 8 10" opacity={0.8}></path></svg>);
}



export function SolarClipboardListBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="#c4c0c0" d="M21 15.998v-6c0-2.828 0-4.242-.879-5.121C19.353 4.109 18.175 4.012 16 4H8c-2.175.012-3.353.109-4.121.877C3 5.756 3 7.17 3 9.998v6c0 2.829 0 4.243.879 5.122c.878.878 2.293.878 5.121.878h6c2.828 0 4.243 0 5.121-.878c.879-.88.879-2.293.879-5.122" opacity={0.5}></path><path fill="#c4c0c0" d="M8 3.5A1.5 1.5 0 0 1 9.5 2h5A1.5 1.5 0 0 1 16 3.5v1A1.5 1.5 0 0 1 14.5 6h-5A1.5 1.5 0 0 1 8 4.5z"></path><path fill="#c4c0c0" fillRule="evenodd" d="M6.25 10.5A.75.75 0 0 1 7 9.75h.5a.75.75 0 0 1 0 1.5H7a.75.75 0 0 1-.75-.75m3.5 0a.75.75 0 0 1 .75-.75H17a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1-.75-.75M6.25 14a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5H7a.75.75 0 0 1-.75-.75m3.5 0a.75.75 0 0 1 .75-.75H17a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1-.75-.75m-3.5 3.5a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5H7a.75.75 0 0 1-.75-.75m3.5 0a.75.75 0 0 1 .75-.75H17a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1-.75-.75" clipRule="evenodd"></path></svg>);
}


export function SolarWidgetAddBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" fillRule="evenodd" d="M17.5 2.75a.75.75 0 0 1 .75.75v2.25h2.25a.75.75 0 0 1 0 1.5h-2.25V9.5a.75.75 0 0 1-1.5 0V7.25H14.5a.75.75 0 0 1 0-1.5h2.25V3.5a.75.75 0 0 1 .75-.75" clipRule="evenodd"></path><path fill="currentColor" d="M2 6.5c0-2.121 0-3.182.659-3.841S4.379 2 6.5 2s3.182 0 3.841.659S11 4.379 11 6.5s0 3.182-.659 3.841S8.621 11 6.5 11s-3.182 0-3.841-.659S2 8.621 2 6.5m11 11c0-2.121 0-3.182.659-3.841S15.379 13 17.5 13s3.182 0 3.841.659S22 15.379 22 17.5s0 3.182-.659 3.841S19.621 22 17.5 22s-3.182 0-3.841-.659S13 19.621 13 17.5"></path><path fill="currentColor" d="M2 17.5c0-2.121 0-3.182.659-3.841S4.379 13 6.5 13s3.182 0 3.841.659S11 15.379 11 17.5s0 3.182-.659 3.841S8.621 22 6.5 22s-3.182 0-3.841-.659S2 19.621 2 17.5" opacity={0.5}></path></svg>);
}

export function SolarChartSquareBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12 22c-4.714 0-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22" opacity={0.5}></path><path fill="currentColor" d="M12 5.25a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75m-5 3a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-1.5 0V9A.75.75 0 0 1 7 8.25m10 4a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0v-5a.75.75 0 0 1 .75-.75"></path></svg>);
}

export function SolarCalculatorBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12 22c-4.243 0-6.364 0-7.682-1.465C3 19.072 3 16.714 3 12s0-7.071 1.318-8.536S7.758 2 12 2s6.364 0 7.682 1.464C21 4.93 21 7.286 21 12s0 7.071-1.318 8.535S16.242 22 12 22" opacity={0.5}></path><path fill="currentColor" d="M15 6H9c-.465 0-.697 0-.888.051a1.5 1.5 0 0 0-1.06 1.06C7 7.304 7 7.536 7 8s0 .697.051.888a1.5 1.5 0 0 0 1.06 1.06C8.304 10 8.536 10 9 10h6c.465 0 .697 0 .888-.051a1.5 1.5 0 0 0 1.06-1.06C17 8.696 17 8.464 17 8s0-.697-.051-.888a1.5 1.5 0 0 0-1.06-1.06C15.697 6 15.464 6 15 6m-7 8a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2m4-4a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2m4-4a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2"></path></svg>);
}




export function SolarDownloadBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M22 16v-1c0-2.828 0-4.242-.879-5.12C20.242 9 18.828 9 16 9H8c-2.829 0-4.243 0-5.122.88C2 10.757 2 12.17 2 14.997V16c0 2.829 0 4.243.879 5.122C3.757 22 5.172 22 8 22h8c2.828 0 4.243 0 5.121-.878C22 20.242 22 18.829 22 16" opacity={0.5}></path><path fill="currentColor" fillRule="evenodd" d="M12 1.25a.75.75 0 0 0-.75.75v10.973l-1.68-1.961a.75.75 0 1 0-1.14.976l3 3.5a.75.75 0 0 0 1.14 0l3-3.5a.75.75 0 1 0-1.14-.976l-1.68 1.96V2a.75.75 0 0 0-.75-.75" clipRule="evenodd"></path></svg>);
}


export function DuoIconsBank(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" fillRule="evenodd" d="m12.67 2.217l8.5 4.75A1.5 1.5 0 0 1 22 8.31v1.44c0 .69-.56 1.25-1.25 1.25H20v8h1a1 1 0 1 1 0 2H3a1 1 0 1 1 0-2h1v-8h-.75C2.56 11 2 10.44 2 9.75V8.31c0-.522.27-1.002.706-1.274l8.623-4.819c.422-.211.92-.211 1.342 0z" className="duoicon-secondary-layer" opacity={0.5}></path><path fill="currentColor" fillRule="evenodd" d="M12 6a1 1 0 1 0 0 2a1 1 0 0 0 0-2m5 5H7v8h2v-6h2v6h2v-6h2v6h2z" className="duoicon-primary-layer"></path></svg>);
}


export function SolarFolderBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M22 14v-2.202c0-2.632 0-3.949-.77-4.804a3 3 0 0 0-.224-.225C20.151 6 18.834 6 16.202 6h-.374c-1.153 0-1.73 0-2.268-.153a4 4 0 0 1-.848-.352C12.224 5.224 11.816 4.815 11 4l-.55-.55c-.274-.274-.41-.41-.554-.53a4 4 0 0 0-2.18-.903C7.53 2 7.336 2 6.95 2c-.883 0-1.324 0-1.692.07A4 4 0 0 0 2.07 5.257C2 5.626 2 6.068 2 6.95V14c0 3.771 0 5.657 1.172 6.828S6.229 22 10 22h4c3.771 0 5.657 0 6.828-1.172S22 17.771 22 14" opacity={0.5}></path><path fill="currentColor" d="M12.25 10a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75"></path></svg>);
}


export function SolarCheckSquareBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12 22c-4.714 0-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22" opacity={0.2}></path><path fill="currentColor" d="M16.03 8.97a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 1 1 1.06-1.06l1.47 1.47l4.47-4.47a.75.75 0 0 1 1.06 0"></path></svg>);
}

export function SolarRefreshSquareLinear(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none"><path fill="currentColor" strokeWidth={2.2} d="M7.378 11.63h-.75zm0 .926l-.562.497a.75.75 0 0 0 1.08.044zm2.141-1.015a.75.75 0 0 0-1.038-1.082zm-2.958-1.038a.75.75 0 1 0-1.122.994zm8.37-1.494a.75.75 0 1 0 1.102-1.018zM12.045 6.25c-2.986 0-5.416 2.403-5.416 5.38h1.5c0-2.137 1.747-3.88 3.916-3.88zm-5.416 5.38v.926h1.5v-.926zm1.269 1.467l1.622-1.556l-1.038-1.082l-1.622 1.555zm.042-1.039l-1.378-1.555l-1.122.994l1.377 1.556zm8.094-4.067a5.42 5.42 0 0 0-3.99-1.741v1.5a3.92 3.92 0 0 1 2.889 1.26zm.585 3.453l.56-.498a.75.75 0 0 0-1.08-.043zm-2.139 1.014a.75.75 0 1 0 1.04 1.082zm2.96 1.04a.75.75 0 0 0 1.12-.997zm-8.393 1.507a.75.75 0 0 0-1.094 1.026zm2.888 2.745c2.993 0 5.434-2.4 5.434-5.38h-1.5c0 2.135-1.753 3.88-3.934 3.88zm5.434-5.38v-.926h-1.5v.926zm-1.27-1.467l-1.619 1.555l1.04 1.082l1.618-1.555zm-.04 1.04l1.38 1.554l1.122-.996l-1.381-1.555zM7.952 16.03a5.45 5.45 0 0 0 3.982 1.719v-1.5c-1.143 0-2.17-.48-2.888-1.245z"></path><path stroke="currentColor" strokeWidth={2.2} d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12Z"></path></g></svg>);
}


export function SolarRefreshCircleBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><circle cx={12} cy={12} r={10} fill="currentColor" opacity={0.3}></circle><path fill="currentColor" d="M7.378 11.63h-.75zm0 .926l-.562.497a.75.75 0 0 0 1.08.044zm2.141-1.015a.75.75 0 0 0-1.038-1.082zm-2.958-1.038a.75.75 0 1 0-1.122.994zm8.37-1.494a.75.75 0 1 0 1.102-1.018zM12.045 6.25c-2.986 0-5.416 2.403-5.416 5.38h1.5c0-2.137 1.747-3.88 3.916-3.88zm-5.416 5.38v.926h1.5v-.926zm1.269 1.467l1.622-1.556l-1.038-1.082l-1.622 1.555zm.042-1.039l-1.378-1.555l-1.122.994l1.377 1.556zm8.094-4.067a5.42 5.42 0 0 0-3.99-1.741v1.5a3.92 3.92 0 0 1 2.889 1.26zm.585 3.453l.56-.498a.75.75 0 0 0-1.08-.043zm-2.139 1.014a.75.75 0 1 0 1.04 1.082zm2.96 1.04a.75.75 0 0 0 1.12-.997zm-8.393 1.507a.75.75 0 0 0-1.094 1.026zm2.888 2.745c2.993 0 5.434-2.4 5.434-5.38h-1.5c0 2.135-1.753 3.88-3.934 3.88zm5.434-5.38v-.926h-1.5v.926zm-1.27-1.467l-1.619 1.555l1.04 1.082l1.618-1.555zm-.04 1.04l1.38 1.554l1.122-.996l-1.381-1.555zM7.952 16.03a5.45 5.45 0 0 0 3.982 1.719v-1.5c-1.143 0-2.17-.48-2.888-1.245z"></path></svg>);
}

export function FluentMoneyHand20Regular(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 20 20" {...props}><path fill="currentColor" d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h7a1.5 1.5 0 0 0 1.5-1.5V15a.5.5 0 0 0-.5-.5c-.413 0-.677-.102-.856-.236q-.273-.204-.424-.623c-.214-.588-.22-1.367-.22-2.141a.5.5 0 0 0-.147-.354l-.286-.287l-1.213-1.213c-.467-.467-.604-.78-.63-.955c-.02-.14.022-.234.122-.33c.214-.205.367-.344.54-.386c.103-.026.338-.044.76.378l3 3a.5.5 0 0 0 .708-.707L13 9.793V6.707l2.56 2.56a1.5 1.5 0 0 1 .44 1.061V17.5a.5.5 0 0 0 1 0v-7.172a2.5 2.5 0 0 0-.732-1.767L13 5.293V3.5A1.5 1.5 0 0 0 11.5 2zM12 5.5v3.293l-1.146-1.147c-.578-.578-1.154-.777-1.705-.643a1.5 1.5 0 0 0-.313.115A3 3 0 0 0 5 10a3 3 0 0 0 5.007 2.23c.017.578.075 1.21.273 1.753c.148.407.384.796.764 1.08l.006.006A1.5 1.5 0 0 0 10 16.5v.5H6v-.5A1.5 1.5 0 0 0 4.5 15H4V5h.5A1.5 1.5 0 0 0 6 3.5V3h4v.5A1.5 1.5 0 0 0 11.5 5h.5zm0 11v.009a.5.5 0 0 1-.5.491H11v-.5a.5.5 0 0 1 .5-.5h.5zM6 10a2 2 0 0 1 1.874-1.996c-.124.23-.187.51-.139.833c.071.482.378.983.911 1.516l.907.907A2 2 0 0 1 6 10M5 3v.5a.5.5 0 0 1-.5.5H4v-.5a.5.5 0 0 1 .5-.5zM4 16h.5a.5.5 0 0 1 .5.5v.5h-.5a.5.5 0 0 1-.5-.5zm8-12h-.5a.5.5 0 0 1-.5-.5V3h.5a.5.5 0 0 1 .5.5z"></path></svg>);
}

export function SolarChatRoundMoneyBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12c0 1.6.376 3.112 1.043 4.453c.178.356.237.763.134 1.148l-.595 2.226a1.3 1.3 0 0 0 1.591 1.592l2.226-.596a1.63 1.63 0 0 1 1.149.133A9.96 9.96 0 0 0 12 22" opacity={0.5}></path><path fill="currentColor" d="M12.75 8a.75.75 0 0 0-1.5 0v.01c-1.089.275-2 1.133-2 2.323c0 1.457 1.365 2.417 2.75 2.417c.824 0 1.25.533 1.25.917s-.426.916-1.25.916s-1.25-.532-1.25-.916a.75.75 0 0 0-1.5 0c0 1.19.911 2.049 2 2.323V16a.75.75 0 0 0 1.5 0v-.01c1.089-.274 2-1.133 2-2.323c0-1.457-1.365-2.417-2.75-2.417c-.824 0-1.25-.533-1.25-.917s.426-.916 1.25-.916s1.25.532 1.25.916a.75.75 0 0 0 1.5 0c0-1.19-.911-2.048-2-2.323z"></path></svg>);
}


export function SolarFireBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12.832 21.801c3.126-.626 7.168-2.875 7.168-8.69c0-5.291-3.873-8.815-6.658-10.434c-.619-.36-1.342.113-1.342.828v1.828c0 1.442-.606 4.074-2.29 5.169c-.86.559-1.79-.278-1.894-1.298l-.086-.838c-.1-.974-1.092-1.565-1.87-.971C4.461 8.46 3 10.33 3 13.11C3 20.221 8.289 22 10.933 22q.232 0 .484-.015c.446-.056 0 .099 1.415-.185" opacity={0.5}></path><path fill="currentColor" d="M8 18.444c0 2.62 2.111 3.43 3.417 3.542c.446-.056 0 .099 1.415-.185C13.871 21.434 15 20.492 15 18.444c0-1.297-.819-2.098-1.46-2.473c-.196-.115-.424.03-.441.256c-.056.718-.746 1.29-1.215.744c-.415-.482-.59-1.187-.59-1.638v-.59c0-.354-.357-.59-.663-.408C9.495 15.008 8 16.395 8 18.445"></path></svg>);
}


export function PhPiggyBankDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={256} height={256} viewBox="0 0 256 256" {...props}><g fill="currentColor"><path d="M240 112v32a16 16 0 0 1-16 16h-8l-18.1 50.69a8 8 0 0 1-7.54 5.31h-12.72a8 8 0 0 1-7.54-5.31L166.29 200H97.71l-3.81 10.69a8 8 0 0 1-7.54 5.31H73.64a8 8 0 0 1-7.54-5.31L53 174a79.7 79.7 0 0 1-21-54a80 80 0 0 1 80-80h32a80 80 0 0 1 73.44 48.22a82 82 0 0 1 2.9 7.78H224a16 16 0 0 1 16 16" opacity={0.2}></path><path d="M192 116a12 12 0 1 1-12-12a12 12 0 0 1 12 12m-40-52h-40a8 8 0 0 0 0 16h40a8 8 0 0 0 0-16m96 48v32a24 24 0 0 1-24 24h-2.36l-16.21 45.38A16 16 0 0 1 190.36 224h-12.72a16 16 0 0 1-15.07-10.62l-1.92-5.38h-57.3l-1.92 5.38A16 16 0 0 1 86.36 224H73.64a16 16 0 0 1-15.07-10.62L46 178.22a87.7 87.7 0 0 1-21.44-48.38A16 16 0 0 0 16 144a8 8 0 0 1-16 0a32 32 0 0 1 24.28-31A88.12 88.12 0 0 1 112 32h104a8 8 0 0 1 0 16h-21.39a87.93 87.93 0 0 1 30.17 37c.43 1 .85 2 1.25 3A24 24 0 0 1 248 112m-16 0a8 8 0 0 0-8-8h-3.66a8 8 0 0 1-7.64-5.6A71.9 71.9 0 0 0 144 48h-32a72 72 0 0 0-53.09 120.64a8 8 0 0 1 1.64 2.71L73.64 208h12.72l3.82-10.69a8 8 0 0 1 7.53-5.31h68.58a8 8 0 0 1 7.53 5.31l3.82 10.69h12.72l18.11-50.69A8 8 0 0 1 216 152h8a8 8 0 0 0 8-8Z"></path></g></svg>);
}


export function SolarCloseCircleBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10" opacity={0.5}></path><path fill="currentColor" d="M8.97 8.97a.75.75 0 0 1 1.06 0L12 10.94l1.97-1.97a.75.75 0 1 1 1.06 1.06L13.06 12l1.97 1.97a.75.75 0 0 1-1.06 1.06L12 13.06l-1.97 1.97a.75.75 0 0 1-1.06-1.06L10.94 12l-1.97-1.97a.75.75 0 0 1 0-1.06"></path></svg>);
}


export function DuoIconsAlertOctagon(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" fillRule="evenodd" d="M15.314 2a2 2 0 0 1 1.414.586l4.686 4.686A2 2 0 0 1 22 8.686v6.628a2 2 0 0 1-.586 1.414l-4.686 4.686a2 2 0 0 1-1.414.586H8.686a2 2 0 0 1-1.414-.586l-4.686-4.686A2 2 0 0 1 2 15.314V8.686a2 2 0 0 1 .586-1.414l4.686-4.686A2 2 0 0 1 8.686 2z" className="duoicon-secondary-layer" opacity={0.3}></path><path fill="currentColor" fillRule="evenodd" d="M12 6a1 1 0 0 0-.993.883L11 7v6a1 1 0 0 0 1.993.117L13 13V7a1 1 0 0 0-1-1m0 9a1 1 0 1 0 0 2a1 1 0 0 0 0-2" className="duoicon-primary-layer"></path></svg>);
}


export function SolarShieldBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M3 11.991c0 5.638 4.239 8.375 6.899 9.536c.721.315 1.082.473 2.101.473V8l-9 3z"></path><path fill="currentColor" d="M14.101 21.527C16.761 20.365 21 17.63 21 11.991V11l-9-3v14c1.02 0 1.38-.158 2.101-.473M8.838 2.805L8.265 3c-3.007 1.03-4.51 1.545-4.887 2.082C3 5.62 3 7.22 3 10.417V11l9-3V2c-.811 0-1.595.268-3.162.805" opacity={0.5}></path><path fill="currentColor" d="m15.735 3l-.573-.195C13.595 2.268 12.812 2 12 2v6l9 3v-.583c0-3.198 0-4.797-.378-5.335c-.377-.537-1.88-1.052-4.887-2.081"></path></svg>);
}


export function DuoIconsCreditCard(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M22 10v7a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-7z" className="duoicon-secondary-layer" opacity={0.3}></path><path fill="currentColor" d="M19 4a3 3 0 0 1 3 3v1H2V7a3 3 0 0 1 3-3zm-1 10h-3a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2" className="duoicon-primary-layer"></path></svg>);
}



export function MemoryArrowTopRight(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 22 22" {...props}><path fill="currentColor" d="M8 5h9v9h-2V9h-1v1h-1v1h-1v1h-1v1h-1v1H9v1H8v1H7v-1H6v-1h1v-1h1v-1h1v-1h1v-1h1V9h1V8h1V7H8z"></path></svg>);
}


export function FinancesIconDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg
		xmlns="http://www.w3.org/2000/svg"
		width={24} height={24}
		viewBox="0 0 24 24"
		fill="none"
		{...props}
	  >
		<g id="SVGRepo_bgCarrier" strokeWidth={0} />
		<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
		<g id="SVGRepo_iconCarrier">
		  {" "}
		  <path
			opacity="0.4"
			d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2Z"
			fill="currentColor"
		  />{" "}
		  <path
			d="M6.88086 18.9001C6.47086 18.9001 6.13086 18.5601 6.13086 18.1501V16.0801C6.13086 15.6701 6.47086 15.3301 6.88086 15.3301C7.29086 15.3301 7.63086 15.6701 7.63086 16.0801V18.1501C7.63086 18.5701 7.29086 18.9001 6.88086 18.9001Z"
		fill="currentColor"
		  />{" "}
		  <path
			d="M12 18.9C11.59 18.9 11.25 18.56 11.25 18.15V14C11.25 13.59 11.59 13.25 12 13.25C12.41 13.25 12.75 13.59 12.75 14V18.15C12.75 18.57 12.41 18.9 12 18.9Z"
			fill="currentColor"
		  />{" "}
		  <path
			d="M17.1191 18.9002C16.7091 18.9002 16.3691 18.5602 16.3691 18.1502V11.9302C16.3691 11.5202 16.7091 11.1802 17.1191 11.1802C17.5291 11.1802 17.8691 11.5202 17.8691 11.9302V18.1502C17.8691 18.5702 17.5391 18.9002 17.1191 18.9002Z"
		fill="currentColor"
		  />{" "}
		  <path
			d="M17.871 5.8201C17.871 5.7701 17.851 5.7101 17.841 5.6601C17.831 5.6201 17.821 5.5701 17.811 5.5301C17.791 5.4901 17.761 5.4601 17.741 5.4201C17.711 5.3801 17.681 5.3301 17.641 5.3001C17.631 5.2901 17.631 5.2801 17.621 5.2801C17.591 5.2601 17.561 5.2501 17.531 5.2301C17.491 5.2001 17.441 5.1701 17.391 5.1501C17.341 5.1301 17.291 5.1301 17.241 5.1201C17.201 5.1101 17.171 5.1001 17.131 5.1001H14.201C13.791 5.1001 13.451 5.4401 13.451 5.8501C13.451 6.2601 13.791 6.6001 14.201 6.6001H15.451C13.071 9.1001 10.071 10.8601 6.70096 11.7101C6.30096 11.8101 6.05096 12.2201 6.15096 12.6201C6.23096 12.9601 6.54096 13.1901 6.88096 13.1901C6.94096 13.1901 7.00096 13.1801 7.06096 13.1701C10.631 12.2801 13.821 10.4301 16.371 7.8101V8.7801C16.371 9.1901 16.711 9.5301 17.121 9.5301C17.531 9.5301 17.871 9.1901 17.871 8.7801V5.8501C17.871 5.8401 17.871 5.8301 17.871 5.8201Z"
			fill="currentColor"
		  />{" "}
		</g>
	  </svg>
	  
	  );
}


export function EntypoProgressTwo(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" {...props}><path fill="currentColor" d="M18 5H2C.9 5 0 5.9 0 7v6c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 8H2V7h16zM7 8H3v4h4zm5 0H8v4h4z"></path></svg>);
}


export function LetsIconsTimeProgressDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" fillOpacity={0.25} d="M12 3.3c0-.142 0-.214.046-.258c.045-.044.115-.042.254-.037a9 9 0 1 1-8.25 4.778c.064-.123.097-.184.158-.202s.123.018.246.089l5.547 3.183c.118.068.177.101.196.154c.018.053-.01.124-.065.266a2.005 2.005 0 1 0 2.167-1.255c-.151-.023-.226-.034-.263-.076C12 9.9 12 9.832 12 9.696z"></path><path fill="currentColor" d="M8.65 17.802c-.071.124-.107.186-.09.247c.019.061.08.094.203.158a7 7 0 1 0 3.537-13.2c-.138-.006-.208-.01-.254.035C12 5.086 12 5.157 12 5.3v4.402c0 .136 0 .204.036.246c.037.043.112.054.263.077a2 2 0 0 1 1.63 2.492a1.997 1.997 0 0 1-2.658 1.343c-.142-.056-.213-.083-.265-.065s-.087.077-.155.195z"></path></svg>);
}


export function SolarLibraryBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" fillRule="evenodd" d="M8.672 7.542h6.656c3.374 0 5.062 0 6.01.987s.724 2.511.278 5.56l-.422 2.892c-.35 2.391-.525 3.587-1.422 4.303s-2.22.716-4.867.716h-5.81c-2.646 0-3.97 0-4.867-.716s-1.072-1.912-1.422-4.303l-.422-2.892c-.447-3.049-.67-4.573.278-5.56s2.636-.987 6.01-.987M8 18c0-.414.373-.75.833-.75h6.334c.46 0 .833.336.833.75s-.373.75-.833.75H8.833c-.46 0-.833-.336-.833-.75" clipRule="evenodd"></path><path fill="currentColor" d="M8.51 2h6.98c.233 0 .41 0 .567.015c1.108.109 2.014.775 2.399 1.672H5.544c.385-.897 1.292-1.563 2.4-1.672C8.099 2 8.278 2 8.51 2" opacity={0.4}></path><path fill="currentColor" d="M6.31 4.723c-1.39 0-2.53.84-2.91 1.953l-.024.07a8 8 0 0 1 1.232-.253c1.08-.138 2.446-.138 4.032-.138h6.892c1.586 0 2.952 0 4.032.138c.42.054.834.133 1.232.253l-.023-.07c-.38-1.114-1.52-1.953-2.911-1.953z" opacity={0.7}></path></svg>);
}


export function SolarGraphUpBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12" opacity={0.5}></path><path fill="currentColor" d="M14.5 10.75a.75.75 0 0 1 0-1.5H17a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-.69l-2.013 2.013a1.75 1.75 0 0 1-2.474 0l-1.586-1.586a.25.25 0 0 0-.354 0L7.53 14.53a.75.75 0 0 1-1.06-1.06l2.293-2.293a1.75 1.75 0 0 1 2.474 0l1.586 1.586a.25.25 0 0 0 .354 0l2.012-2.013z"></path></svg>);
}

export function HomeCategory(props: SVGProps<SVGSVGElement>) {
	return (
	  <svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 64 64"
		width={24}
		height={24}
		fill="currentColor"
		{...props}
	  >
		<g>
		  <path
			fill="#F9EBB2"
			d="M56,60c0,1.104-0.896,2-2,2H38V47c0-0.553-0.447-1-1-1H27c-0.553,0-1,0.447-1,1v15H10
			  c-1.104,0-2-0.896-2-2V31.411L32.009,7.403L56,31.394V60z"
		  />
		  <polygon fill="#F76D57" points="14,6 18,6 18,12.601 14,16.593" />
		  <rect x="28" y="48" fill="#F9EBB2" width="8" height="14" />
		  <path
			fill="#F76D57"
			d="M61,33c-0.276,0-0.602-0.036-0.782-0.217L32.716,5.281c-0.195-0.195-0.451-0.293-0.707-0.293
			  s-0.512,0.098-0.707,0.293L3.791,32.793C3.61,32.974,3.276,33,3,33c-0.553,0-1-0.447-1-1c0-0.276,0.016-0.622,0.197-0.803
			  L31.035,2.41c0,0,0.373-0.41,0.974-0.41s0.982,0.398,0.982,0.398l28.806,28.805C61.978,31.384,62,31.724,62,32
			  C62,32.552,61.553,33,61,33z"
		  />
		  <g>
			<path
			  fill="#394240"
			  d="M63.211,29.789L34.438,1.015c0,0-0.937-1.015-2.43-1.015s-2.376,0.991-2.376,0.991L20,10.604V5
				c0-0.553-0.447-1-1-1h-6c-0.553,0-1,0.447-1,1v13.589L0.783,29.783C0.24,30.326,0,31.172,0,32c0,1.656,1.343,3,3,3
				c0.828,0,1.662-0.251,2.205-0.794L6,33.411V60c0,2.211,1.789,4,4,4h44c2.211,0,4-1.789,4-4V33.394l0.804,0.804
				C59.347,34.739,60.172,35,61,35c1.657,0,3-1.343,3-3C64,31.171,63.754,30.332,63.211,29.789z M14,6h4v6.601l-4,3.992V6z
				M36,62h-8V48h8V62z M56,60c0,1.104-0.896,2-2,2H38V47c0-0.553-0.447-1-1-1H27c-0.553,0-1,0.447-1,1v15H10
				c-1.104,0-2-0.896-2-2V31.411L32.009,7.403L56,31.394V60z M61,33c-0.276,0-0.602-0.036-0.782-0.217L32.716,5.281
				c-0.195-0.195-0.451-0.293-0.707-0.293s-0.512,0.098-0.707,0.293L3.791,32.793C3.61,32.974,3.276,33,3,33
				c-0.553,0-1-0.447-1-1c0-0.276,0.016-0.622,0.197-0.803L31.035,2.41c0,0,0.373-0.41,0.974-0.41s0.982,0.398,0.982,0.398
				l28.806,28.805C61.978,31.384,62,31.724,62,32C62,32.552,61.553,33,61,33z"
			/>
			<path
			  fill="#394240"
			  d="M23,32h-8c-0.553,0-1,0.447-1,1v8c0,0.553,0.447,1,1,1h8c0.553,0,1-0.447,1-1v-8
				C24,32.447,23.553,32,23,32z M22,40h-6v-6h6V40z"
			/>
			<path
			  fill="#394240"
			  d="M41,42h8c0.553,0,1-0.447,1-1v-8c0-0.553-0.447-1-1-1h-8c-0.553,0-1,0.447-1,1v8
				C40,41.553,40.447,42,41,42z M42,34h6v6h-6V34z"
			/>
		  </g>
		  <rect x="28" y="48" fill="#506C7F" width="8" height="14" />
		  <g>
			<rect x="16" y="34" fill="#45AAB8" width="6" height="6" />
			<rect x="42" y="34" fill="#45AAB8" width="6" height="6" />
		  </g>
		</g>
	  </svg>
	);
  }
export function SolarMegaphoneDuotone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      {...props}
    >
      <g>
        <g>
          <path
            fill="#394240"
            d="M61,29H49c-1.657,0-3,1.344-3,3s1.343,3,3,3h12c1.657,0,3-1.344,3-3S62.657,29,61,29z M61,33H49
            c-0.553,0-1-0.447-1-1s0.447-1,1-1h12c0.553,0,1,0.447,1,1S61.553,33,61,33z"
          />
          <path
            fill="#394240"
            d="M59.312,44.57l-11.275-4.104c-1.559-0.566-3.279,0.236-3.846,1.793c-0.566,1.555,0.235,3.277,1.793,3.844
            l11.276,4.105c1.558,0.566,3.278-0.238,3.845-1.793C61.672,46.859,60.87,45.137,59.312,44.57z M59.227,47.732
            c-0.189,0.52-0.763,0.785-1.281,0.598l-11.277-4.105c-0.52-0.189-0.786-0.762-0.598-1.281c0.189-0.52,0.763-0.787,1.282-0.598
            l11.276,4.104C59.148,46.639,59.416,47.213,59.227,47.732z"
          />
          <path
            fill="#394240"
            d="M48.036,23.531l11.276-4.104c1.557-0.566,2.359-2.289,1.793-3.844c-0.566-1.557-2.288-2.361-3.846-1.795
            l-11.275,4.105c-1.559,0.566-2.36,2.289-1.794,3.846C44.757,23.295,46.479,24.098,48.036,23.531z M46.668,19.773l11.276-4.105
            c0.519-0.188,1.093,0.08,1.281,0.6c0.189,0.52-0.078,1.092-0.597,1.281l-11.277,4.104c-0.52,0.189-1.093-0.078-1.281-0.598
            C45.881,20.535,46.148,19.963,46.668,19.773z"
          />
          <path
            fill="#394240"
            d="M37.531,0.307c-1.492-0.625-3.211-0.277-4.359,0.867L18.859,15.486c0,0-0.422,0.514-1.359,0.514
            C16.293,16,4,16.002,4,16.002c-2.211,0-4,1.789-4,4V44c0,2.211,1.789,4,4,4c0,0,12.688,0,13.344,0s1.107,0.107,1.671,0.67
            c0.563,0.564,14.157,14.158,14.157,14.158C33.938,63.594,34.961,64,36,64c0.516,0,1.035-0.098,1.531-0.305
            C39.027,63.078,40,61.617,40,60V4.002C40,2.385,39.027,0.924,37.531,0.307z M6,46H4c-1.104,0-2-0.896-2-2V20c0-1.105,0.896-2,2-2
            h2V46z M12,46H8V18h4V46z M38,60c0,2-2.188,2.812-4,1c-1.109-1.109-14-14-14-14c-0.75-0.75-1.437-1-2.499-1H14V18h3.501
            C18.563,18,19,18,20,17c0,0,12.766-12.766,14-14c1.781-1.782,4-0.97,4,1C38,5.062,38,58.938,38,60z"
          />
        </g>
        <rect x="8" y="18" fill="#45AAB8" width="4" height="28" />
        <g>
          <path
            fill="#F76D57"
            d="M2,20v24c0,1.104,0.896,2,2,2h2V18H4C2.896,18,2,18.895,2,20z"
          />
          <path
            fill="#F76D57"
            d="M34,3c-1.234,1.233-14,14-14,14c-1,1-1.437,1-2.499,1H14v28h3.501c1.062,0,1.749,0.25,2.499,1
            c0,0,12.891,12.891,14,14c1.812,1.812,4,1,4-1c0-1.062,0-54.938,0-56C38,2.031,35.781,1.218,34,3z"
          />
        </g>
        <g>
          <path
            fill="#B4CCB9"
            d="M47.352,21.652l11.277-4.104c0.519-0.189,0.786-0.762,0.597-1.281c-0.188-0.52-0.763-0.787-1.281-0.6
            l-11.276,4.105c-0.52,0.189-0.787,0.762-0.598,1.281C46.259,21.574,46.832,21.842,47.352,21.652z"
          />
          <path
            fill="#B4CCB9"
            d="M61,31H49c-0.553,0-1,0.447-1,1s0.447,1,1,1h12c0.553,0,1-0.447,1-1S61.553,31,61,31z"
          />
          <path
            fill="#B4CCB9"
            d="M58.629,46.449l-11.276-4.104c-0.52-0.189-1.093,0.078-1.282,0.598c-0.188,0.52,0.078,1.092,0.598,1.281
            l11.277,4.105c0.519,0.188,1.092-0.078,1.281-0.598S59.148,46.639,58.629,46.449z"
          />
        </g>
        <path
          opacity="0.2"
          d="M2,20v24c0,1.104,0.896,2,2,2h2V18H4C2.896,18,2,18.895,2,20z"
        />
      </g>
    </svg>
  );
}


export function SolarBar(props: SVGProps<SVGSVGElement>) {
	return (
	<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 64 64"
	fill="#000000"
>
	<g>
		<g>
			<path
				fill="#F76D57"
				d="M2,15.998v30c0,1.104,0.896,2,2,2h12v-4H7c-0.553,0-1-0.447-1-1v-24c0-0.553,0.447-1,1-1h9v-4H4
				   C2.896,13.998,2,14.893,2,15.998z"
			/>
			<path
				fill="#F76D57"
				d="M18,60c0,1.105,0.896,2,2,2h36c1.104,0,2-0.895,2-2v-4H18V60z"
			/>
			<path
				fill="#F76D57"
				d="M56,15.998c-1.588,0-3.063-0.469-4.309-1.268c-1.099,1.381-2.79,2.268-4.691,2.268
				   c-1.326,0-2.548-0.436-3.541-1.164c-1.43,1.338-3.346,2.164-5.459,2.164c-2.191,0-4.175-0.883-5.62-2.311
				   c-1.259,0.826-2.762,1.311-4.38,1.311c-2.748,0-5.171-1.387-6.611-3.498c-0.732,0.318-1.539,0.498-2.389,0.498
				   c-0.342,0-0.674-0.035-1-0.09V54h40V15.998l0.354-0.354C57.609,15.875,56.819,15.998,56,15.998z"
			/>
		</g>
		<path
			fill="#F9EBB2"
			d="M56,13.998c-1.237,0-2.387-0.375-3.343-1.018c-0.671-0.451-1.242-1.037-1.685-1.715
			   c-0.055,0.82-0.352,1.564-0.825,2.174c-0.731,0.941-1.862,1.559-3.147,1.559c-0.839,0-1.616-0.262-2.26-0.703
			   c-0.594-0.408-1.065-0.975-1.369-1.635c-0.328,0.658-0.772,1.248-1.309,1.742c-1.069,0.988-2.493,1.596-4.062,1.596
			   c-1.583,0-3.02-0.619-4.092-1.619c-0.498-0.467-0.917-1.014-1.233-1.625c-0.429,0.533-0.948,0.986-1.532,1.348
			   c-0.915,0.564-1.989,0.896-3.143,0.896c-2.048,0-3.854-1.029-4.937-2.596c-0.412-0.596-0.715-1.27-0.89-1.994
			   c-0.437,0.572-1.015,1.027-1.693,1.299c-0.459,0.184-0.956,0.291-1.48,0.291c-2.209,0-4-1.791-4-4s1.791-4,4-4
			   c0.839,0,1.616,0.26,2.26,0.703c0.594,0.406,1.065,0.975,1.369,1.637c0.327-0.662,0.771-1.25,1.308-1.746
			   C25.006,3.605,26.431,2.998,28,2.998c1.583,0,3.02,0.617,4.092,1.619c0.498,0.467,0.917,1.014,1.233,1.623
			   c0.429-0.531,0.948-0.986,1.532-1.348C35.772,4.328,36.846,3.998,38,3.998c0.445,0,0.878,0.053,1.296,0.145
			   c0.675,0.148,1.305,0.412,1.873,0.768c0.188-0.66,0.524-1.26,0.996-1.732c0.725-0.729,1.727-1.18,2.835-1.18
			   c1.729,0,3.188,1.104,3.747,2.641c0.08,0.221,0.145,0.449,0.185,0.684c0.503,0.17,0.978,0.402,1.41,0.693
			   c0.143-0.406,0.326-0.791,0.548-1.15c1.056-1.719,2.946-2.867,5.11-2.867c3.313,0,6,2.686,6,6
			   C62,11.311,59.313,13.998,56,13.998z"
		/>
		<g>
			<path
				fill="#394240"
				d="M38,19.998c-0.553,0-1,0.447-1,1v26c0,0.553,0.447,1,1,1s1-0.447,1-1v-26
				   C39,20.445,38.553,19.998,38,19.998z"
			/>
			<path
				fill="#394240"
				d="M48,19.998c-0.553,0-1,0.447-1,1v26c0,0.553,0.447,1,1,1s1-0.447,1-1v-26
				   C49,20.445,48.553,19.998,48,19.998z"
			/>
			<path
				fill="#394240"
				d="M28,19.998c-0.553,0-1,0.447-1,1v26c0,0.553,0.447,1,1,1s1-0.447,1-1v-26
				   C29,20.445,28.553,19.998,28,19.998z"
			/>
			<path
				fill="#394240"
				d="M56-0.002c-2.386,0-4.521,1.051-5.987,2.707C48.939,1.074,47.097-0.002,45-0.002
				   c-1.93,0-3.642,0.914-4.739,2.33c-0.717-0.213-1.475-0.33-2.261-0.33c-1.618,0-3.121,0.484-4.38,1.311
				   C32.175,1.881,30.191,0.998,28,0.998c-2.113,0-4.029,0.826-5.459,2.164C21.548,2.434,20.326,1.998,19,1.998c-3.313,0-6,2.686-6,6
				   c0,1.539,0.584,2.938,1.537,4H4c-2.211,0-4,1.789-4,4v30c0,2.211,1.789,4,4,4h12V60c0,2.211,1.789,4,4,4h36c2.211,0,4-1.789,4-4
				   V14.92c2.389-1.385,4-3.963,4-6.922C64,3.58,60.418-0.002,56-0.002z M16,41.998H8v-22h8V41.998z M16,17.998H7
				   c-0.553,0-1,0.447-1,1v24c0,0.553,0.447,1,1,1h9v4H4c-1.104,0-2-0.896-2-2v-30c0-1.105,0.896-2,2-2h12V17.998z M58,60
				   c0,1.105-0.896,2-2,2H20c-1.104,0-2-0.895-2-2v-4h40V60z M58,15.998V54H18V13.908c0.326,0.055,0.658,0.09,1,0.09
				   c0.85,0,1.656-0.18,2.389-0.498c1.44,2.111,3.863,3.498,6.611,3.498c1.618,0,3.121-0.484,4.38-1.311
				   c1.445,1.428,3.429,2.311,5.62,2.311c2.113,0,4.029-0.826,5.459-2.164c0.993,0.729,2.215,1.164,3.541,1.164
				   c1.901,0,3.593-0.887,4.691-2.268c1.245,0.799,2.721,1.268,4.309,1.268c0.819,0,1.609-0.123,2.354-0.354L58,15.998z M56,13.998
				   c-1.237,0-2.387-0.375-3.343-1.018c-0.671-0.451-1.242-1.037-1.685-1.715c-0.055,0.82-0.352,1.564-0.825,2.174
				   c-0.731,0.941-1.862,1.559-3.147,1.559c-0.839,0-1.616-0.262-2.26-0.703c-0.594-0.408-1.065-0.975-1.369-1.635
				   c-0.328,0.658-0.772,1.248-1.309,1.742c-1.069,0.988-2.493,1.596-4.062,1.596c-1.583,0-3.02-0.619-4.092-1.619
				   c-0.498-0.467-0.917-1.014-1.233-1.625c-0.429,0.533-0.948,0.986-1.532,1.348c-0.915,0.564-1.989,0.896-3.143,0.896
				   c-2.048,0-3.854-1.029-4.937-2.596c-0.412-0.596-0.715-1.27-0.89-1.994c-0.437,0.572-1.015,1.027-1.693,1.299
				   c-0.459,0.184-0.956,0.291-1.48,0.291c-2.209,0-4-1.791-4-4s1.791-4,4-4c0.839,0,1.616,0.26,2.26,0.703
				   c0.594,0.406,1.065,0.975,1.369,1.637c0.327-0.662,0.771-1.25,1.308-1.746C25.006,3.605,26.431,2.998,28,2.998
				   c1.583,0,3.02,0.617,4.092,1.619c0.498,0.467,0.917,1.014,1.233,1.623c0.429-0.531,0.948-0.986,1.532-1.348
				   C35.772,4.328,36.846,3.998,38,3.998c0.445,0,0.878,0.053,1.296,0.145c0.675,0.148,1.305,0.412,1.873,0.768
				   c0.188-0.66,0.524-1.26,0.996-1.732c0.725-0.729,1.727-1.18,2.835-1.18c1.729,0,3.188,1.104,3.747,2.641
				   c0.08,0.221,0.145,0.449,0.185,0.684c0.503,0.17,0.978,0.402,1.41,0.693c0.143-0.406,0.326-0.791,0.548-1.15
				   c1.056-1.719,2.946-2.867,5.11-2.867c3.313,0,6,2.686,6,6C62,11.311,59.313,13.998,56,13.998z"
			/>
		</g>
		<path
			opacity="0.2"
			d="M16,17.998H7c-0.553,0-1,0.447-1,1v24c0,0.553,0.447,1,1,1h9v4H4c-1.104,0-2-0.896-2-2v-30
			   c0-1.105,0.896-2,2-2h12V17.998z"
		/>
		<path
			opacity="0.2"
			d="M58,60c0,1.105-0.896,2-2,2H20c-1.104,0-2-0.895-2-2v-4h40V60z"
		/>
	</g>
</svg>
	);
  }


export function SolarHeartBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={24}
			height={24}
			viewBox="0 0 64 64"
			fill="currentColor"
			{...props}
		>
			<path
				fill="#F76D57"
				d="M58.714,29.977c0,0-0.612,0.75-1.823,1.961S33.414,55.414,33.414,55.414C33.023,55.805,32.512,56,32,56
          s-1.023-0.195-1.414-0.586c0,0-22.266-22.266-23.477-23.477s-1.823-1.961-1.823-1.961C3.245,27.545,2,24.424,2,21
          C2,13.268,8.268,7,16,7c3.866,0,7.366,1.566,9.899,4.101l0.009-0.009l4.678,4.677c0.781,0.781,2.047,0.781,2.828,0l4.678-4.677
          l0.009,0.009C40.634,8.566,44.134,7,48,7c7.732,0,14,6.268,14,14C62,24.424,60.755,27.545,58.714,29.977z"
			></path>
			<path
				fill="#394240"
				d="M48,5c-4.418,0-8.418,1.791-11.313,4.687l-3.979,3.961c-0.391,0.391-1.023,0.391-1.414,0
          c0,0-3.971-3.97-3.979-3.961C24.418,6.791,20.418,5,16,5C7.163,5,0,12.163,0,21c0,3.338,1.024,6.436,2.773,9
          c0,0,0.734,1.164,1.602,2.031s24.797,24.797,24.797,24.797C29.953,57.609,30.977,58,32,58s2.047-0.391,2.828-1.172
          c0,0,23.93-23.93,24.797-24.797S61.227,30,61.227,30C62.976,27.436,64,24.338,64,21C64,12.163,56.837,5,48,5z
          M58.714,29.977c0,0-0.612,0.75-1.823,1.961S33.414,55.414,33.414,55.414C33.023,55.805,32.512,56,32,56
          s-1.023-0.195-1.414-0.586c0,0-22.266-22.266-23.477-23.477s-1.823-1.961-1.823-1.961C3.245,27.545,2,24.424,2,21
          C2,13.268,8.268,7,16,7c3.866,0,7.366,1.566,9.899,4.101l0.009-0.009l4.678,4.677c0.781,0.781,2.047,0.781,2.828,0l4.678-4.677
          l0.009,0.009C40.634,8.566,44.134,7,48,7c7.732,0,14,6.268,14,14C62,24.424,60.755,27.545,58.714,29.977z"
			></path>
			<path
				fill="#394240"
				d="M48,11c-0.553,0-1,0.447-1,1s0.447,1,1,1c4.418,0,8,3.582,8,8c0,0.553,0.447,1,1,1s1-0.447,1-1
          C58,15.478,53.522,11,48,11z"
			></path>
		</svg>
	);
}

export function SolarGiftBoxBoldDuotone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={24}
      height={24}
      {...props}
    >
      <g>
        <g>
          <path
            fill="#45AAB8"
            d="M2,4v14c0,1.102,0.897,2,2,2h2V2H4C2.897,2,2,2.895,2,4z"
          />
          <path
            fill="#45AAB8"
            d="M14,60c0,1.102,0.897,2,2,2h32c1.103,0,2-0.898,2-2v-2H14V60z"
          />
          <path
            fill="#45AAB8"
            d="M43.527,2.982C41.365,7.148,37.02,10,32,10c-5.019,0-9.362-2.85-11.526-7.016C20.307,2.662,20,2,19.014,2H8v18h4c1.104,0,2,0.895,2,2v34h36V22c0-1.105,0.896-2,2-2h4V2H44.986C44,2,43.693,2.662,43.527,2.982z"
          />
          <path
            fill="#45AAB8"
            d="M60,2h-2v18h2c1.103,0,2-0.898,2-2V4C62,2.895,61.103,2,60,2z"
          />
        </g>
        <g>
          <path
            fill="#394240"
            d="M60,0H44.501c-2,0-2.395,1.383-2.725,2.023C39.952,5.57,36.264,8,32,8c-4.271,0-7.968-2.439-9.787-5.996C21.888,1.367,21.46,0,19.501,0H4C1.789,0,0,1.787,0,4v14c0,2.211,1.789,4,4,4h8v38c0,2.211,1.789,4,4,4h32c2.211,0,4-1.789,4-4V22h8c2.211,0,4-1.789,4-4V4C64,1.787,62.211,0,60,0z M6,20H4c-1.103,0-2-0.898-2-2V4c0-1.105,0.897-2,2-2h2V20z M50,60c0,1.102-0.897,2-2,2H16c-1.103,0-2-0.898-2-2v-2h36V60z M56,20h-4c-1.104,0-2,0.895-2,2v34H14V22c0-1.105-0.896-2-2-2H8V2h11.014c0.986,0,1.293,0.662,1.46,0.984C22.638,7.15,26.981,10,32,10c5.02,0,9.365-2.852,11.527-7.018C43.693,2.662,44,2,44.986,2H56V20z M62,18c0,1.102-0.897,2-2,2h-2V2h2c1.103,0,2,0.895,2,2V18z"
          />
          <path
            fill="#394240"
            d="M36,20c-1.104,0-2.104,0.447-2.828,1.17L32,22.336l-1.172-1.166C30.104,20.447,29.104,20,28,20c-2.209,0-4,1.789-4,4c0,1.104,0.713,2.135,1.438,2.857l5.855,5.857c0.391,0.391,1.023,0.391,1.414,0l5.84-5.84C39.271,26.15,40,25.104,40,24C40,21.789,38.209,20,36,20z M37.156,25.436L32,30.592l-5.156-5.156C26.481,25.074,26,24.551,26,24c0-1.105,0.896-2,2-2c0.553,0,1.053,0.223,1.414,0.586l1.879,1.869c0.391,0.391,1.023,0.391,1.414,0l1.879-1.869C34.947,22.223,35.447,22,36,22c1.104,0,2,0.895,2,2C38,24.551,37.519,25.074,37.156,25.436z"
          />
        </g>
        <path
          fill="#F9EBB2"
          d="M37.156,25.436L32,30.592l-5.156-5.156C26.481,25.074,26,24.551,26,24c0-1.105,0.896-2,2-2 c0.553,0,1.053,0.223,1.414,0.586l1.879,1.869c0.391,0.391,1.023,0.391,1.414,0l1.879-1.869C34.947,22.223,35.447,22,36,22 c1.104,0,2,0.895,2,2C38,24.551,37.519,25.074,37.156,25.436z"
        />
        <g>
          <path
            fill="#506C7F"
            d="M2,4v14c0,1.102,0.897,2,2,2h2V2H4C2.897,2,2,2.895,2,4z"
          />
          <path
            fill="#506C7F"
            d="M14,60c0,1.102,0.897,2,2,2h32c1.103,0,2-0.898,2-2v-2H14V60z"
          />
          <path
            fill="#506C7F"
            d="M60,2h-2v18h2c1.103,0,2-0.898,2-2V4C62,2.895,61.103,2,60,2z"
          />
        </g>
      </g>
    </svg>
  );
}


export function SolarDrinkGlassBoldDuotone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={24}
      height={24}
      {...props}
    >
      <path
        fill="#394240"
        d="M63.442,12.385c0.556-0.578,0.712-1.432,0.397-2.17C63.525,9.479,62.802,9,62,9h-6.585l2.292-2.291
        c0.391-0.393,0.391-1.025,0-1.416c-0.392-0.391-1.024-0.391-1.415,0L52.585,9H21.81C20.868,3.881,16.392,0,11,0
        C4.925,0,0,4.924,0,11c0,6.074,4.925,11,11,11c2.571,0,4.932-0.889,6.805-2.367L34,35.828V58h-8c-1.104,0-2,0.895-2,2v4h26v-4
        c0-1.105-0.896-2-2-2h-8V35.826L63.442,12.385z M53.415,11H62l-4,4h-8.585L53.415,11z M11,20c-4.971,0-9-4.029-9-9s4.029-9,9-9
        c4.282,0,7.859,2.992,8.77,7H12c-0.809,0-1.538,0.486-1.848,1.234s-0.139,1.607,0.434,2.18l5.791,5.791
        C14.876,19.326,13.019,20,11,20z M16,15l-4-4h38.585l-4,4H16z M44.585,17l-1.896,1.896c-1.212-0.449-2.822-0.006-4.074,1.246
        s-1.694,2.861-1.247,4.074l-2.289,2.289c-0.391,0.391-0.391,1.023,0,1.414s1.023,0.391,1.414,0l2.289-2.289
        c1.213,0.447,2.824,0.006,4.076-1.246s1.693-2.863,1.246-4.074L47.415,17H56L37,36L18,17H44.585z M41.443,22.971
        c-0.863,0.865-1.833,0.996-2.121,0.707c-0.289-0.289-0.157-1.258,0.706-2.121s1.833-0.996,2.122-0.707
        C42.438,21.139,42.307,22.107,41.443,22.971z M38,37.721V58h-2V37.723C36.303,37.898,36.645,38,37,38c0.007,0,0.014,0,0.021,0
        C37.369,37.996,37.703,37.893,38,37.721z M47,60c0.553,0,1,0.447,1,1v1H26v-1c0-0.553,0.447-1,1-1H47z"
      />
      <path
        fill="#F76D57"
        d="M38.614,20.143c-1.252,1.252-1.694,2.861-1.247,4.074l-2.289,2.289c-0.391,0.391-0.391,1.023,0,1.414
        s1.023,0.391,1.414,0l2.289-2.289c1.213,0.447,2.824,0.006,4.076-1.246s1.693-2.863,1.246-4.074L47.415,17H56L37,36L18,17h26.585
        l-1.896,1.896C41.477,18.447,39.866,18.891,38.614,20.143z"
      />
      <path
        fill="#B4CCB9"
        d="M11,20c-4.971,0-9-4.029-9-9s4.029-9,9-9c4.282,0,7.859,2.992,8.77,7H12c-0.809,0-1.538,0.486-1.848,1.234
        s-0.139,1.607,0.434,2.18l5.791,5.791C14.876,19.326,13.019,20,11,20z"
      />
      <polygon fill="#F9EBB2" points="50.585,11 12,11 16,15 46.585,15" />
      <path
        fill="#F9EBB2"
        d="M36,37.723V58h2V37.721c-0.297,0.172-0.631,0.275-0.979,0.279c-0.007,0-0.014,0-0.021,0
        C36.645,38,36.303,37.898,36,37.723z"
      />
      <path
        fill="#F9EBB2"
        d="M47,60H27c-0.553,0-1,0.447-1,1v1h22v-1C48,60.447,47.553,60,47,60z"
      />
      <polygon fill="#F9EBB2" points="53.415,11 49.415,15 58,15 62,11" />
      <path
        opacity="0.15"
        fill="#231F20"
        d="M36,37.723V58h2V37.721c-0.297,0.172-0.631,0.275-0.979,0.279c-0.007,0-0.014,0-0.021,0
        C36.645,38,36.303,37.898,36,37.723z"
      />
      <path
        fill="#45AAB8"
        d="M41.443,22.971c-0.863,0.865-1.833,0.996-2.121,0.707c-0.289-0.289-0.157-1.258,0.706-2.121
        s1.833-0.996,2.122-0.707C42.438,21.139,42.307,22.107,41.443,22.971z"
      />
    </svg>
  );
}
export function SolarPencil(props: SVGProps<SVGSVGElement>)  {return (
	<svg
	  viewBox="0 0 64 64"
	  xmlns="http://www.w3.org/2000/svg"
	  fill="none"
	  {...props}
	>
	  <g>
		<path
		  fill="#F9EBB2"
		  d="M3.001 61.999c-.553 0-1.001-.446-1-.999l.001-13.141L16.143 62H3.001z"
		/>
		<path
		  fill="#F76D57"
		  d="M61.414 16.729l-4.259 4.259L43.013 6.845l4.258-4.257a2 2 0 0 1 2.829-.002l11.314 11.314a2 2 0 0 1 0 2.829z"
		/>
		<rect
		  x="37.256"
		  y="14.744"
		  transform="rotate(45 37.256 14.744)"
		  fill="#F9EBB2"
		  width="20.001"
		  height="4"
		/>
		<rect
		  x="-1.848"
		  y="28.74"
		  transform="rotate(-45 -1.848 28.74)"
		  fill="#45AAB8"
		  width="48.002"
		  height="5.001"
		/>
		<rect
		  x="8.76"
		  y="39.348"
		  transform="rotate(-45 8.76 39.348)"
		  fill="#45AAB8"
		  width="48"
		  height="4.999"
		/>
		<rect
		  x="3.456"
		  y="33.544"
		  transform="rotate(-45 3.456 33.544)"
		  fill="#45AAB8"
		  width="48.001"
		  height="5.999"
		/>
		<rect
		  x="-1.847"
		  y="28.74"
		  transform="rotate(135 -1.847 28.74)"
		  opacity="0.2"
		  fill="#231F20"
		  width="48.001"
		  height="5"
		/>
		<rect
		  x="30.26"
		  y="17.847"
		  transform="rotate(45 30.26 17.847)"
		  opacity="0.2"
		  fill="#231F20"
		  width="4.999"
		  height="48"
		/>
		<path
		  fill="#394240"
		  d="M62.828 12.486 51.514 1.172a4 4 0 0 0-5.657.001L.602 46.428A2 2 0 0 0 0 48v14a2 2 0 0 0 2 2h14a2 2 0 0 0 1.572-.602L62.828 18.143a4 4 0 0 0 0-5.657zM2.001 61v-1.583l2.582 2.582H3.001A1 1 0 0 1 2.001 61zm5.41 1-5.41-5.41v-8.73L16.143 62H7.411zm45.501-36.77L38.771 11.088l-1.414 1.414 3.535 3.535L6.951 49.979l1.414 1.414 33.94-33.941 4.243 4.243-33.941 33.94 1.414 1.415 33.941-33.94 3.535 3.535L17.557 60.586 3.414 46.443 41.599 8.259l14.143 14.143-2.329 2.328zM61.414 16.729l-4.259 4.259L43.013 6.845l4.258-4.257a2 2 0 0 1 2.829-.002l11.314 11.314a2 2 0 0 1 0 2.829z"
		/>
	  </g>
	</svg>
  );}

  export function BookIcon(props: SVGProps<SVGSVGElement>) {
	return (
	  <svg
		viewBox="0 0 64 64"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		{...props}
	  >
		<g>
		  <path fill="#F9EBB2" d="M56 62H10a4 4 0 0 1 0-8h46v8z" />
		  <g>
			<path
			  fill="#45AAB8"
			  d="M6 4v49.537C7.062 52.584 8.461 52 10 52h2V2H8a2 2 0 0 0-2 2z"
			/>
			<path
			  fill="#45AAB8"
			  d="M56 2H14v50h42h2v-2V4a2 2 0 0 0-2-2z"
			/>
		  </g>
		  <g>
			<path
			  fill="#394240"
			  d="M60 52V4a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v54c0 3.313 2.687 6 6 6h49a1 1 0 0 0 0-2h-1v-8c1.104 0 2-.896 2-2zM6 4a2 2 0 0 1 2-2h4v50h-2a5.97 5.97 0 0 0-4 1.537V4zm50 58H10a4 4 0 0 1 0-8h46v8zm0-10H14V2h42a2 2 0 0 1 2 2v46h-2z"
			/>
			<path
			  fill="#394240"
			  d="M43 26H23a1 1 0 1 0 0 2h20a1 1 0 1 0 0-2zm6-6H23a1 1 0 1 0 0 2h26a1 1 0 1 0 0-2zm-26-4h12a1 1 0 1 0 0-2H23a1 1 0 1 0 0 2z"
			/>
		  </g>
		  <path
			opacity="0.2"
			fill="#231F20"
			d="M6 4v49.537C7.062 52.584 8.461 52 10 52h2V2H8a2 2 0 0 0-2 2z"
		  />
		</g>
	  </svg>
	);
  }
  
  export function MonitorFlatIcon(props: SVGProps<SVGSVGElement>) {return (
	<svg
	  xmlns="http://www.w3.org/2000/svg"
	  viewBox="0 0 64 64"
	  fill="#000000"
	>
	  <g>
		<g>
		  <path
			fill="#394240"
			d="M60,0H4C1.789,0,0,1.789,0,4v40c0,2.211,1.789,4,4,4h24v10h-8c-2.209,0-4,1.791-4,4v1
			c0,0.553,0.447,1,1,1h30c0.553,0,1-0.447,1-1v-1c0-2.209-1.791-4-4-4h-8V48h24c2.211,0,4-1.789,4-4V4
			C64,1.789,62.211,0,60,0z M44,60c1.104,0,2,0.896,2,2H18c0-1.104,0.896-2,2-2H44z M34,58h-4V48h4V58z
			M62,44c0,1.104-0.896,2-2,2H4c-1.104,0-2-0.896-2-2v-4h60V44z M62,38H2V4c0-1.104,0.896-2,2-2h56
			c1.104,0,2,0.896,2,2V38z"
		  />
		</g>
		<g>
		  <path
			fill="#506C7F"
			d="M2,40v4c0,1.104,0.896,2,2,2h56c1.104,0,2-0.896,2-2v-4H2z"
		  />
		  <rect x="30" y="48" fill="#506C7F" width="4" height="10" />
		  <path
			fill="#506C7F"
			d="M44,60H20c-1.104,0-2,0.896-2,2h28C46,60.896,45.104,60,44,60z"
		  />
		</g>
		<g>
		  <path
			fill="#B4CCB9"
			d="M2,4v34h60V4c0-1.104-0.896-2-2-2H4C2.896,2,2,2.896,2,4z"
		  />
		</g>
		<circle fill="#394240" cx="32" cy="43" r="2" />
		<rect x="30" y="48" opacity="0.3" width="4" height="10" />
	  </g>
	</svg>
  );}
  

  export function CameraIcon(props: SVGProps<SVGSVGElement>) {
	return (
	  <svg
		version="1.0"
		id="Layer_1"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		viewBox="0 0 64 64"
		fill="#000000"
		{...props}
	  >
		<g>
		  <g>
			<path
			  fill="#506C7F"
			  d="M15,2C9.477,2,5,6.477,5,12s4.477,10,10,10s10-4.477,10-10S20.523,2,15,2z M10,13c-0.553,0-1-0.447-1-1
			  s0.447-1,1-1s1,0.447,1,1S10.553,13,10,13z M15,18c-0.553,0-1-0.447-1-1s0.447-1,1-1s1,0.447,1,1S15.553,18,15,18z M15,8
			  c-0.553,0-1-0.447-1-1s0.447-1,1-1s1,0.447,1,1S15.553,8,15,8z M20,13c-0.553,0-1-0.447-1-1s0.447-1,1-1s1,0.447,1,1
			  S20.553,13,20,13z"
			/>
			<path
			  fill="#506C7F"
			  d="M37,2c-5.523,0-10,4.477-10,10s4.477,10,10,10s10-4.477,10-10S42.523,2,37,2z M32,13c-0.553,0-1-0.447-1-1
			  s0.447-1,1-1s1,0.447,1,1S32.553,13,32,13z M37,18c-0.553,0-1-0.447-1-1s0.447-1,1-1s1,0.447,1,1S37.553,18,37,18z M37,8
			  c-0.553,0-1-0.447-1-1s0.447-1,1-1s1,0.447,1,1S37.553,8,37,8z M42,13c-0.553,0-1-0.447-1-1s0.447-1,1-1s1,0.447,1,1
			  S42.553,13,42,13z"
			/>
		  </g>
		  <path
			fill="#45AAB8"
			d="M50,60c0,1.104-0.896,2-2,2H4c-1.104,0-2-0.896-2-2V26c0-1.104,0.896-2,2-2h44c1.104,0,2,0.896,2,2V60z"
		  />
		  <g>
			<polygon fill="#F9EBB2" points="52,51.279 58,53.279 58,32.721 52,34.72 " />
			<polygon fill="#F9EBB2" points="60,32.055 60,53.945 62,54.612 62,31.388 " />
		  </g>
		  <path
			fill="#394240"
			d="M39,12c0,1.656,1.344,3,3,3s3-1.344,3-3s-1.344-3-3-3S39,10.344,39,12z M42,11c0.553,0,1,0.447,1,1
			s-0.447,1-1,1s-1-0.447-1-1S41.447,11,42,11z"
		  />
		  <path
			fill="#394240"
			d="M37,10c1.656,0,3-1.344,3-3s-1.344-3-3-3s-3,1.344-3,3S35.344,10,37,10z M37,6c0.553,0,1,0.447,1,1
			s-0.447,1-1,1s-1-0.447-1-1S36.447,6,37,6z"
		  />
		  <path
			fill="#394240"
			d="M37,14c-1.656,0-3,1.344-3,3s1.344,3,3,3s3-1.344,3-3S38.656,14,37,14z M37,18c-0.553,0-1-0.447-1-1
			s0.447-1,1-1s1,0.447,1,1S37.553,18,37,18z"
		  />
		  <path
			fill="#394240"
			d="M35,12c0-1.656-1.344-3-3-3s-3,1.344-3,3s1.344,3,3,3S35,13.656,35,12z M31,12c0-0.553,0.447-1,1-1
			s1,0.447,1,1s-0.447,1-1,1S31,12.553,31,12z"
		  />
		  <path
			fill="#394240"
			d="M23,12c0-1.656-1.344-3-3-3s-3,1.344-3,3s1.344,3,3,3S23,13.656,23,12z M20,13c-0.553,0-1-0.447-1-1
			s0.447-1,1-1s1,0.447,1,1S20.553,13,20,13z"
		  />
		  <path
			fill="#394240"
			d="M15,10c1.656,0,3-1.344,3-3s-1.344-3-3-3s-3,1.344-3,3S13.344,10,15,10z M15,6c0.553,0,1,0.447,1,1
			s-0.447,1-1,1s-1-0.447-1-1S14.447,6,15,6z"
		  />
		  <path
			fill="#394240"
			d="M15,14c-1.656,0-3,1.344-3,3s1.344,3,3,3s3-1.344,3-3S16.656,14,15,14z M15,18c-0.553,0-1-0.447-1-1
			s0.447-1,1-1s1,0.447,1,1S15.553,18,15,18z"
		  />
		  <path
			fill="#394240"
			d="M13,12c0-1.656-1.344-3-3-3s-3,1.344-3,3s1.344,3,3,3S13,13.656,13,12z M10,13c-0.553,0-1-0.447-1-1
			s0.447-1,1-1s1,0.447,1,1S10.553,13,10,13z"
		  />
		  <g>
			<path
			  fill="#394240"
			  d="M63.585,29.188c-0.262-0.188-0.598-0.241-0.901-0.137L52,32.612V26c0-2.211-1.789-4-4-4h-4.372
			  C46.864,19.852,49,16.177,49,12c0-6.629-5.374-12-12-12c-4.923,0-9.149,2.968-11,7.211C24.149,2.968,19.923,0,15,0
			  C8.374,0,3,5.371,3,12c0,4.177,2.136,7.852,5.372,10H4c-2.211,0-4,1.789-4,4v34c0,2.211,1.789,4,4,4h44c2.211,0,4-1.789,4-4
			  v-6.613l10.684,3.562C62.787,56.983,62.894,57,63,57c0.207,0,0.412-0.064,0.585-0.188C63.846,56.623,64,56.321,64,56V30
			  C64,29.679,63.846,29.377,63.585,29.188z"
			/>
			<path
			  fill="#394240"
			  d="M36,36H16c-0.553,0-1,0.448-1,1v12c0,0.552,0.447,1,1,1h20c0.553,0,1-0.448,1-1V37
			  C37,36.448,36.553,36,36,36z M35,48H17V38h18V48z"
			/>
		  </g>
		  <polygon opacity="0.15" points="62,54.612 60,53.945 60,32.055 62,31.388 " />
		  <rect x="17" y="38" opacity="0.2" fill="#FFFFFF" width="18" height="10" />
		</g>
	  </svg>
	);
  }

export function General(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      version="1.0"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 64 64"
      fill="#000000"
      {...props}
    >
      <g>
        <polygon
          fill="#45AAB8"
          points="58,50.586 46.586,61.998 17.414,61.998 6,50.586 6,15.998 58,15.998"
        />
        <g>
          <path
            fill="#F9EBB2"
            d="M6,59.998c0,1.105,0.896,2,2,2h6.586L6,53.412V59.998z"
          />
          <path
            fill="#F9EBB2"
            d="M49.414,61.998H56c1.104,0,2-0.895,2-2v-6.586L49.414,61.998z"
          />
        </g>
        <path
          fill="#F76D57"
          d="M62,11.998c0,1.105-0.896,2-2,2H4c-1.104,0-2-0.895-2-2v-8c0-1.104,0.896-2,2-2h56
          c1.104,0,2,0.896,2,2V11.998z"
        />
        <path
          fill="#394240"
          d="M60-0.002H4c-2.211,0-4,1.789-4,4v8c0,2.211,1.789,4,4,4v44c0,2.211,1.789,4,4,4h48
          c2.211,0,4-1.789,4-4v-44c2.211,0,4-1.789,4-4v-8C64,1.787,62.211-0.002,60-0.002z M58,50.586L46.586,61.998H17.414L6,50.586V15.998h52V50.586z
          M6,59.998v-6.586l8.586,8.586H8C6.896,61.998,6,61.104,6,59.998z M56,61.998h-6.586L58,53.412v6.586
          C58,61.104,57.104,61.998,56,61.998z M62,11.998c0,1.105-0.896,2-2,2H4c-1.104,0-2-0.895-2-2v-8
          c0-1.104,0.896-2,2-2h56c1.104,0,2,0.896,2,2V11.998z"
        />
        <path
          fill="#394240"
          d="M21,31.998h22c1.657,0,3-1.344,3-3s-1.343-3-3-3H21c-1.657,0-3,1.344-3,3S19.343,31.998,21,31.998z
          M21,27.998h22c0.553,0,1,0.447,1,1s-0.447,1-1,1H21c-0.553,0-1-0.447-1-1S20.447,27.998,21,27.998z"
        />
        <path
          fill="#506C7F"
          d="M21,27.998h22c0.553,0,1,0.447,1,1s-0.447,1-1,1H21c-0.553,0-1-0.447-1-1S20.447,27.998,21,27.998z"
        />
      </g>
    </svg>
  );
}

export function GroceriesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      version="1.0"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 64 64"
      fill="#000000"
      {...props}
    >
      <g>
        <g>
          <circle fill="#B4CCB9" cx="46" cy="58" r="4" />
          <circle fill="#B4CCB9" cx="20.09" cy="58" r="4" />
          <path
            fill="#B4CCB9"
            d="M10,3C9.837,2.455,9.386,2,8.833,2H3C2.447,2,2,2.447,2,3s0.447,1,1,1c0,0,3.833,0,4.529,0 S8.38,4.611,8.38,4.611l2.814,11.965C11.762,16.209,12.526,16,13.518,16h-0.459L10,3z"
          />
        </g>
        <path
          fill="#F76D57"
          d="M61.974,20l-6,26c-0.271,1.166-1.021,2-2.125,2H20.131c-1.102,0-1.85-0.834-2.12-2l-5.988-26 c-0.312-1.23,0.125-2,1.479-2h46.989C61.849,18,62.286,18.77,61.974,20z"
        />
        <circle fill="#394240" cx="46" cy="58" r="1" />
        <circle fill="#394240" cx="20.09" cy="58" r="1" />
        <g>
          <path
            fill="#394240"
            d="M60.476,16H15.059L12,3c-0.438-1.75-1.614-3-3.271-3H3C1.343,0,0,1.342,0,3c0,1.656,1.343,3,3,3h3.723 l3.371,14l7.698,32.457C15.619,53.359,14.09,55.5,14.09,58c0,3.312,2.687,6,6,6c2.972,0,5.433-2.162,5.91-5h14.09 c0.478,2.838,2.938,5,5.91,5c3.313,0,6-2.688,6-6c0-3.314-2.687-6-6-6c-2.972,0-5.433,2.164-5.91,5H26 c-0.478-2.836-2.938-5-5.91-5c-0.125,0-0.246,0.012-0.369,0.018l-0.642-2.258c0.428,0.145,0.893,0.24,1.426,0.24h32.969 c2.625,0,3.908-1.904,4.5-4l5.933-26C64.344,17.582,63.265,16,60.476,16z M46,54c2.209,0,4,1.791,4,4s-1.791,4-4,4s-4-1.791-4-4 S43.791,54,46,54z M8.38,4.611C8.38,4.611,8.226,4,7.529,4S3,4,3,4C2.447,4,2,3.553,2,3s0.447-1,1-1h5.833 C9.386,2,9.837,2.455,10,3l3.059,13h0.459c-0.991,0-1.756,0.209-2.323,0.576L8.38,4.611z M20.09,54c2.209,0,4,1.791,4,4 s-1.791,4-4,4s-4-1.791-4-4S17.881,54,20.09,54z M61.974,20l-6,26c-0.271,1.166-1.021,2-2.125,2H20.131 c-1.102,0-1.85-0.834-2.12-2l-5.988-26c-0.312-1.23,0.125-2,1.479-2h46.989C61.849,18,62.286,18.77,61.974,20z"
          />
          <path
            fill="#394240"
            d="M37,22c-1.657,0-3,1.342-3,3v16c0,1.656,1.343,3,3,3s3-1.344,3-3V25C40,23.342,38.657,22,37,22z M38,41 c0,0.553-0.447,1-1,1s-1-0.447-1-1V25c0-0.553,0.447-1,1-1s1,0.447,1,1V41z"
          />
          <path
            fill="#394240"
            d="M47,22c-1.657,0-3,1.342-3,3v16c0,1.656,1.343,3,3,3s3-1.344,3-3V25C50,23.342,48.657,22,47,22z M48,41 c0,0.553-0.447,1-1,1s-1-0.447-1-1V25c0-0.553,0.447-1,1-1s1,0.447,1,1V41z"
          />
          <path
            fill="#394240"
            d="M27,22c-1.657,0-3,1.342-3,3v16c0,1.656,1.343,3,3,3s3-1.344,3-3V25C30,23.342,28.657,22,27,22z M28,41 c0,0.553-0.447,1-1,1s-1-0.447-1-1V25c0-0.553,0.447-1,1-1s1,0.447,1,1V41z"
          />
        </g>
        <g opacity="0.2">
          <path
            fill="#231F20"
            d="M47,24c-0.553,0-1,0.447-1,1v16c0,0.553,0.447,1,1,1s1-0.447,1-1V25C48,24.447,47.553,24,47,24z"
          />
          <path
            fill="#231F20"
            d="M37,24c-0.553,0-1,0.447-1,1v16c0,0.553,0.447,1,1,1s1-0.447,1-1V25C38,24.447,37.553,24,37,24z"
          />
          <path
            fill="#231F20"
            d="M27,24c-0.553,0-1,0.447-1,1v16c0,0.553,0.447,1,1,1s1-0.447,1-1V25C28,24.447,27.553,24,27,24z"
          />
        </g>
      </g>
    </svg>
  );
}


export function AddFileIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      version="1.0"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 64 64"
      xmlSpace="preserve"
      fill="#000000"
      {...props}
    >
      <g>
        <g>
          <g>
            <path
              fill="#F76D57"
              d="M2,17v43c0,1.104,0.896,2,2,2h4V15H4C2.896,15,2,15.896,2,17z"
            ></path>
            <rect x="10" y="15" fill="#F76D57" width="44" height="47"></rect>
            <path
              fill="#F76D57"
              d="M60,15h-4v47h4c1.104,0,2-0.896,2-2V17C62,15.896,61.104,15,60,15z"
            ></path>
          </g>
          <path
            fill="#394240"
            d="M60,13H48V4c0-2.211-1.789-4-4-4H20c-2.211,0-4,1.789-4,4v9H4c-2.211,0-4,1.789-4,4v43
            c0,2.211,1.789,4,4,4h56c2.211,0,4-1.789,4-4V17C64,14.789,62.211,13,60,13z M18,4c0-1.104,0.896-2,2-2h24
            c1.104,0,2,0.896,2,2v9h-2V5c0-0.553-0.447-1-1-1H21c-0.553,0-1,0.447-1,1v8h-2V4z M42,6v7H22V6H42z M4,62
            c-1.104,0-2-0.896-2-2V17c0-1.104,0.896-2,2-2h4v47H4z M10,62V15h44v47H10z M62,60c0,1.104-0.896,2-2,2h-4V15h4
            c1.104,0,2,0.896,2,2V60z"
          ></path>
          <path
            fill="#394240"
            d="M43,36h-7v-7c0-0.553-0.447-1-1-1h-6c-0.553,0-1,0.447-1,1v7h-7c-0.553,0-1,0.447-1,1v6
            c0,0.553,0.447,1,1,1h7v7c0,0.553,0.447,1,1,1h6c0.553,0,1-0.447,1-1v-7h7c0.553,0,1-0.447,1-1v-6
            C44,36.447,43.553,36,43,36z M42,42h-8v8h-4v-8h-8v-4h8v-8h4v8h8V42z"
          ></path>
          <g opacity="0.2">
            <path
              fill="#231F20"
              d="M2,17v43c0,1.104,0.896,2,2,2h4V15H4C2.896,15,2,15.896,2,17z"
            ></path>
            <path
              fill="#231F20"
              d="M60,15h-4v47h4c1.104,0,2-0.896,2-2V17C62,15.896,61.104,15,60,15z"
            ></path>
          </g>
          <path
            fill="#B4CCB9"
            d="M18,4c0-1.104,0.896-2,2-2h24c1.104,0,2,0.896,2,2v9h-2V5c0-0.553-0.447-1-1-1H21
            c-0.553,0-1,0.447-1,1v8h-2V4z"
          ></path>
        </g>
        <polygon
          fill="#F9EBB2"
          points="42,38 34,38 34,30 30,30 30,38 22,38 22,42 30,42 30,50 34,50 34,42 42,42 "
        ></polygon>
      </g>
    </svg>
  );
}


export const BankBuildingIcon = (props) => (
	<svg
	  version="1.0"
	  xmlns="http://www.w3.org/2000/svg"
	  viewBox="0 0 64 64"
	  fill="currentColor"
	  {...props}
	>
	  <g>
		<g>
		  <rect x="18" y="25" fill="#506C7F" width="4" height="29" />
		  <rect x="30" y="25" fill="#506C7F" width="4" height="29" />
		  <rect x="42" y="25" fill="#506C7F" width="4" height="29" />
		</g>
		<g>
		  <rect x="48" y="25" fill="#B4CCB9" width="4" height="29" />
		  <rect x="24" y="25" fill="#B4CCB9" width="4" height="29" />
		  <rect x="36" y="25" fill="#B4CCB9" width="4" height="29" />
		  <rect x="12" y="25" fill="#B4CCB9" width="4" height="29" />
		</g>
		<g>
		  <path
			fill="#F9EBB2"
			d="M8,56c-1.104,0-2,0.896-2,2h52c0-1.104-0.895-2-2-2H8z"
		  />
		  <path
			fill="#F9EBB2"
			d="M60,60H4c-1.104,0-2,0.896-2,2h60C62,60.896,61.105,60,60,60z"
		  />
		</g>
		<path
		  fill="#F9EBB2"
		  d="M4,23h56c0.893,0,1.684-0.601,1.926-1.461c0.24-0.86-0.125-1.785-0.889-2.248l-28-17
		  C32.725,2.1,32.365,2,32,2c-0.367,0-0.725,0.1-1.037,0.29L2.961,19.291c-0.764,0.463-1.129,1.388-0.888,2.247
		  C2.315,22.399,3.107,23,4,23z"
		/>
		<g>
		  <path
			fill="#394240"
			d="M60,58c0-2.209-1.791-4-4-4h-2V25h6c1.795,0,3.369-1.194,3.852-2.922
			c0.484-1.728-0.242-3.566-1.775-4.497l-28-17C33.439,0.193,32.719,0,32,0s-1.438,0.193-2.076,0.581l-28,17
			c-1.533,0.931-2.26,2.77-1.775,4.497C0.632,23.806,2.207,25,4,25h6v29H8c-2.209,0-4,1.791-4,4c-2.209,0-4,1.791-4,4v2h64v-2
			C64,59.791,62.209,58,60,58z M4,23c-0.893,0-1.685-0.601-1.926-1.462c-0.241-0.859,0.124-1.784,0.888-2.247l28-17.001
			C31.275,2.1,31.635,2,32,2c0.367,0,0.725,0.1,1.039,0.291l28,17c0.764,0.463,1.129,1.388,0.887,2.248
			C61.686,22.399,60.893,23,60,23H4z M52,25v29h-4V25H52z M46,25v29h-4V25H46z M40,25v29h-4V25H40z M34,25v29h-4V25H34z
			M28,25v29h-4V25H28z M22,25v29h-4V25H22z M16,25v29h-4V25H16z M8,56h48c1.105,0,2,0.896,2,2H6C6,56.896,6.896,56,8,56z M2,62
			c0-1.104,0.896-2,2-2h56c1.105,0,2,0.896,2,2H2z"
		  />
		  <path
			fill="#394240"
			d="M32,9c-2.762,0-5,2.238-5,5s2.238,5,5,5s5-2.238,5-5S34.762,9,32,9z M32,17
			c-1.656,0-3-1.343-3-3s1.344-3,3-3c1.658,0,3,1.343,3,3S33.658,17,32,17z"
		  />
		</g>
		<circle fill="#F76D57" cx="32" cy="14" r="3" />
	  </g>
	</svg>
  );
  

  export const BarChartIcon = (props) => (
	<svg
	  version="1.0"
	  xmlns="http://www.w3.org/2000/svg"
	  viewBox="0 0 64 64"
	  fill="currentColor"
	  {...props}
	>
	  <g>
		<g>
		  <path
			fill="#F9EBB2"
			d="M62,60c0,1.104-0.896,2-2,2H4c-1.104,0-2-0.896-2-2V4c0-1.104,0.896-2,2-2h56c1.104,0,2,0.896,2,2V60z"
		  />
		  <g>
			<path
			  fill="#394240"
			  d="M60,0H4C1.789,0,0,1.789,0,4v56c0,2.211,1.789,4,4,4h56c2.211,0,4-1.789,4-4V4
			  C64,1.789,62.211,0,60,0z M62,60c0,1.104-0.896,2-2,2H4c-1.104,0-2-0.896-2-2V4c0-1.104,0.896-2,2-2h56c1.104,0,2,0.896,2,2V60z"
			/>
			<path
			  fill="#394240"
			  d="M35,8h-6c-0.553,0-1,0.447-1,1v47h8V9C36,8.447,35.553,8,35,8z M34,54h-4V40h4V54z M34,38h-4V10h4V38z"
			/>
			<path
			  fill="#394240"
			  d="M25,16h-6c-0.553,0-1,0.447-1,1v39h8V17C26,16.447,25.553,16,25,16z M24,54h-4V44h4V54z M24,42h-4V18h4V42z"
			/>
			<path
			  fill="#394240"
			  d="M55,24h-6c-0.553,0-1,0.447-1,1v31h8V25C56,24.447,55.553,24,55,24z M54,54h-4V44h4V54z M54,42h-4V26h4V42z"
			/>
			<path
			  fill="#394240"
			  d="M45,32h-6c-0.553,0-1,0.447-1,1v23h8V33C46,32.447,45.553,32,45,32z M44,54h-4v-6h4V54z M44,46h-4V34h4V46z"
			/>
			<path
			  fill="#394240"
			  d="M15,24H9c-0.553,0-1,0.447-1,1v31h8V25C16,24.447,15.553,24,15,24z M14,54h-4v-6h4V54z M14,46h-4V26h4V46z"
			/>
		  </g>
		</g>
		<g>
		  <rect x="10" y="26" fill="#B4CCB9" width="4" height="20" />
		  <rect x="20" y="18" fill="#45AAB8" width="4" height="24" />
		  <rect x="40" y="34" fill="#F76D57" width="4" height="12" />
		  <rect x="30" y="40" fill="#45AAB8" width="4" height="14" />
		  <rect x="50" y="26" fill="#B4CCB9" width="4" height="16" />
		  <rect x="30" y="10" fill="#45AAB8" width="4" height="28" />
		  <rect x="10" y="48" fill="#B4CCB9" width="4" height="6" />
		  <rect x="40" y="48" fill="#F76D57" width="4" height="6" />
		  <rect x="50" y="44" fill="#B4CCB9" width="4" height="10" />
		  <rect x="20" y="44" fill="#45AAB8" width="4" height="10" />
		</g>
		<g opacity="0.2">
		  <rect x="30" y="40" width="4" height="14" />
		  <rect x="10" y="48" width="4" height="6" />
		  <rect x="40" y="48" width="4" height="6" />
		  <rect x="50" y="44" width="4" height="10" />
		  <rect x="20" y="44" width="4" height="10" />
		</g>
	  </g>
	</svg>
  );
  

export function ShoppingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      version="1.0"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 64 64"
      enableBackground="new 0 0 64 64"
      xmlSpace="preserve"
      fill="#000000"
      {...props}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <g>
          <path
            fill="#F9EBB2"
            d="M22,12c0-5.523,4.478-10,10-10s10,4.477,10,10v12h-2V12c0-4.418-3.582-8-8-8s-8,3.582-8,8v12h-2V12z"
          ></path>
          <g>
            <path
              fill="#45AAB8"
              d="M10,60c0,1.104,0.896,2,2,2h40c1.104,0,2-0.896,2-2v-2H10V60z"
            ></path>
            <path
              fill="#45AAB8"
              d="M53,22h-9v3c0,0.553-0.447,1-1,1h-4c-0.553,0-1-0.447-1-1v-3H26v3c0,0.553-0.447,1-1,1h-4
              c-0.553,0-1-0.447-1-1v-3h-9c-0.553,0-1,0.447-1,1v33h44V23C54,22.447,53.553,22,53,22z"
            ></path>
          </g>
          <g>
            <path
              fill="#394240"
              d="M54,20H44v-8c0-6.627-5.373-12-12-12S20,5.373,20,12v8H10c-1.105,0-2,0.895-2,2v38c0,2.211,1.789,4,4,4h40
              c2.211,0,4-1.789,4-4V22C56,20.895,55.105,20,54,20z M22,12c0-5.523,4.478-10,10-10s10,4.477,10,10v12h-2V12c0-4.418-3.582-8-8-8
              s-8,3.582-8,8v12h-2V12z M38,12v8H26v-8c0-3.314,2.687-6,6-6S38,8.686,38,12z M54,60c0,1.104-0.896,2-2,2H12c-1.104,0-2-0.896-2-2
              v-2h44V60z M54,56H10V23c0-0.553,0.447-1,1-1h9v3c0,0.553,0.447,1,1,1h4c0.553,0,1-0.447,1-1v-3h12v3c0,0.553,0.447,1,1,1h4
              c0.553,0,1-0.447,1-1v-3h9c0.553,0,1,0.447,1,1V56z"
            ></path>
            <path
              fill="#394240"
              d="M36,34c-1.104,0-2.104,0.447-2.828,1.172L32,36.336l-1.172-1.164C30.104,34.447,29.104,34,28,34
              c-2.209,0-4,1.791-4,4c0,1.104,0.713,2.135,1.438,2.859l5.855,5.855c0.391,0.391,1.023,0.391,1.414,0l5.84-5.84
              C39.271,40.15,40,39.104,40,38C40,35.791,38.209,34,36,34z M37.156,39.438L32,44.594l-5.156-5.156C26.481,39.076,26,38.553,26,38
              c0-1.105,0.896-2,2-2c0.553,0,1.053,0.223,1.414,0.586l1.879,1.871c0.391,0.391,1.023,0.391,1.414,0l1.879-1.871
              C34.947,36.223,35.447,36,36,36c1.104,0,2,0.895,2,2C38,38.553,37.519,39.076,37.156,39.438z"
            ></path>
          </g>
          <path
            fill="#F76D57"
            d="M37.156,39.438L32,44.594l-5.156-5.156C26.481,39.076,26,38.553,26,38c0-1.105,0.896-2,2-2
            c0.553,0,1.053,0.223,1.414,0.586l1.879,1.871c0.391,0.391,1.023,0.391,1.414,0l1.879-1.871C34.947,36.223,35.447,36,36,36
            c1.104,0,2,0.895,2,2C38,38.553,37.519,39.076,37.156,39.438z"
          ></path>
          <path
            opacity="0.2"
            d="M54,60c0,1.104-0.896,2-2,2H12c-1.104,0-2-0.896-2-2v-2h44V60z"
          ></path>
        </g>
      </g>
    </svg>
  );
}


export function SmartPhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      version="1.0"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 64 64"
      enableBackground="new 0 0 64 64"
      xmlSpace="preserve"
      fill="#000000"
      {...props}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <g>
          <rect x="14" y="10" fill="#506C7F" width="36" height="40"></rect>
          <g>
            <path
              fill="#F9EBB2"
              d="M14,4v4h36V4c0-1.104-0.896-2-2-2H16C14.896,2,14,2.896,14,4z"
            ></path>
            <path
              fill="#F9EBB2"
              d="M50,60v-8H14v8c0,1.104,0.896,2,2,2h32C49.104,62,50,61.104,50,60z"
            ></path>
          </g>
          <path
            fill="#394240"
            d="M48,0H16c-2.211,0-4,1.789-4,4v56c0,2.211,1.789,4,4,4h32c2.211,0,4-1.789,4-4V4C52,1.789,50.211,0,48,0z
              M50,60c0,1.104-0.896,2-2,2H16c-1.104,0-2-0.896-2-2v-8h36V60z M50,50H14V10h36V50z M50,8H14V4c0-1.104,0.896-2,2-2h32
              c1.104,0,2,0.896,2,2V8z"
          ></path>
          <path
            fill="#394240"
            d="M32,60c1.658,0,3-1.342,3-3s-1.342-3-3-3s-3,1.342-3,3S30.342,60,32,60z M32,56c0.553,0,1,0.447,1,1
              s-0.447,1-1,1s-1-0.447-1-1S31.447,56,32,56z"
          ></path>
          <path
            fill="#394240"
            d="M33,4h-6c-0.553,0-1,0.447-1,1s0.447,1,1,1h6c0.553,0,1-0.447,1-1S33.553,4,33,4z"
          ></path>
          <circle fill="#394240" cx="37" cy="5" r="1"></circle>
          <circle fill="#B4CCB9" cx="32" cy="57" r="1"></circle>
        </g>
      </g>
    </svg>
  );
}


export function SolarPlayCircleBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" fillRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10" clipRule="evenodd" opacity={0.3}></path><path fill="currentColor" d="m15.414 13.059l-4.72 2.787C9.934 16.294 9 15.71 9 14.786V9.214c0-.924.934-1.507 1.694-1.059l4.72 2.787c.781.462.781 1.656 0 2.118"></path></svg>);
}


export function PhUsersDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={256} height={256} viewBox="0 0 256 256" {...props}><g fill="currentColor"><path d="M136 108a52 52 0 1 1-52-52a52 52 0 0 1 52 52" opacity={0.2}></path><path d="M117.25 157.92a60 60 0 1 0-66.5 0a95.83 95.83 0 0 0-47.22 37.71a8 8 0 1 0 13.4 8.74a80 80 0 0 1 134.14 0a8 8 0 0 0 13.4-8.74a95.83 95.83 0 0 0-47.22-37.71M40 108a44 44 0 1 1 44 44a44.05 44.05 0 0 1-44-44m210.14 98.7a8 8 0 0 1-11.07-2.33A79.83 79.83 0 0 0 172 168a8 8 0 0 1 0-16a44 44 0 1 0-16.34-84.87a8 8 0 1 1-5.94-14.85a60 60 0 0 1 55.53 105.64a95.83 95.83 0 0 1 47.22 37.71a8 8 0 0 1-2.33 11.07"></path></g></svg>);
}


export function StashCreditCardLight(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M13 14.5a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1"></path><path fill="currentColor" d="M16.821 5H7.18c-.542 0-.98 0-1.333.029c-.365.03-.685.093-.981.243a2.5 2.5 0 0 0-1.093 1.093c-.15.296-.213.616-.243.98c-.027.315-.03.695-.03 1.155v6.821c0 .542 0 .98.029 1.333c.03.365.093.685.243.981a2.5 2.5 0 0 0 1.093 1.092c.296.151.616.214.98.244C6.2 19 6.638 19 7.18 19h9.642c.542 0 .98 0 1.333-.029c.365-.03.685-.093.981-.244a2.5 2.5 0 0 0 1.092-1.092c.151-.296.214-.616.244-.98c.029-.355.029-.792.029-1.334V8.5c0-.46-.003-.84-.029-1.154c-.03-.365-.093-.685-.244-.981a2.5 2.5 0 0 0-1.092-1.093c-.296-.15-.616-.213-.98-.243C17.8 5 17.362 5 16.82 5m2.68 3.5h-15c0-.463.003-.802.026-1.073c.024-.302.07-.476.137-.608a1.5 1.5 0 0 1 .656-.656c.132-.067.306-.113.608-.137C6.236 6 6.632 6 7.2 6h9.6c.568 0 .965 0 1.273.026c.302.024.476.07.608.137a1.5 1.5 0 0 1 .656.656c.067.132.113.306.137.608c.023.271.026.61.026 1.073m-15 2h15v4.8c0 .568 0 .965-.026 1.273c-.024.302-.07.476-.137.608a1.5 1.5 0 0 1-.656.656c-.132.067-.306.113-.608.137c-.308.026-.705.026-1.273.026H7.2c-.568 0-.964 0-1.273-.026c-.302-.024-.476-.07-.608-.137a1.5 1.5 0 0 1-.656-.656c-.067-.132-.113-.306-.137-.608c-.026-.308-.026-.705-.026-1.273z"></path></svg>);
}


export function TablerLayoutSidebarLeftExpandFilled(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M18 3a3 3 0 0 1 2.995 2.824L21 6v12a3 3 0 0 1-2.824 2.995L18 21H6a3 3 0 0 1-2.995-2.824L3 18V6a3 3 0 0 1 2.824-2.995L6 3zm0 2H9v14h9a1 1 0 0 0 .993-.883L19 18V6a1 1 0 0 0-.883-.993zm-4.387 4.21l.094.083l2 2a1 1 0 0 1 .083 1.32l-.083.094l-2 2a1 1 0 0 1-1.497-1.32l.083-.094L13.585 12l-1.292-1.293a1 1 0 0 1-.083-1.32l.083-.094a1 1 0 0 1 1.32-.083"></path></svg>);
}

export function SolarBillListBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M7.245 2h9.51c1.159 0 1.738 0 2.206.163a3.05 3.05 0 0 1 1.881 1.936C21 4.581 21 5.177 21 6.37v14.004c0 .858-.985 1.314-1.608.744a.946.946 0 0 0-1.284 0l-.483.442a1.657 1.657 0 0 1-2.25 0a1.657 1.657 0 0 0-2.25 0a1.657 1.657 0 0 1-2.25 0a1.657 1.657 0 0 0-2.25 0a1.657 1.657 0 0 1-2.25 0l-.483-.442a.946.946 0 0 0-1.284 0c-.623.57-1.608.114-1.608-.744V6.37c0-1.193 0-1.79.158-2.27c.3-.913.995-1.629 1.881-1.937C5.507 2 6.086 2 7.245 2" opacity={0.5}></path><path fill="currentColor" d="M7 6.75a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5zm3.5 0a.75.75 0 0 0 0 1.5H17a.75.75 0 0 0 0-1.5zM7 10.25a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5zm3.5 0a.75.75 0 0 0 0 1.5H17a.75.75 0 0 0 0-1.5zM7 13.75a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5zm3.5 0a.75.75 0 0 0 0 1.5H17a.75.75 0 0 0 0-1.5z"></path></svg>);
}



export function SolarTrashBinTrashOutline(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" fillRule="evenodd" d="M10.31 2.25h3.38c.217 0 .406 0 .584.028a2.25 2.25 0 0 1 1.64 1.183c.084.16.143.339.212.544l.111.335l.03.085a1.25 1.25 0 0 0 1.233.825h3a.75.75 0 0 1 0 1.5h-17a.75.75 0 0 1 0-1.5h3.09a1.25 1.25 0 0 0 1.173-.91l.112-.335c.068-.205.127-.384.21-.544a2.25 2.25 0 0 1 1.641-1.183c.178-.028.367-.028.583-.028m-1.302 3a3 3 0 0 0 .175-.428l.1-.3c.091-.273.112-.328.133-.368a.75.75 0 0 1 .547-.395a3 3 0 0 1 .392-.009h3.29c.288 0 .348.002.392.01a.75.75 0 0 1 .547.394c.021.04.042.095.133.369l.1.3l.039.112q.059.164.136.315z" clipRule="evenodd"></path><path fill="currentColor" d="M5.915 8.45a.75.75 0 1 0-1.497.1l.464 6.952c.085 1.282.154 2.318.316 3.132c.169.845.455 1.551 1.047 2.104s1.315.793 2.17.904c.822.108 1.86.108 3.146.108h.879c1.285 0 2.324 0 3.146-.108c.854-.111 1.578-.35 2.17-.904c.591-.553.877-1.26 1.046-2.104c.162-.813.23-1.85.316-3.132l.464-6.952a.75.75 0 0 0-1.497-.1l-.46 6.9c-.09 1.347-.154 2.285-.294 2.99c-.137.685-.327 1.047-.6 1.303c-.274.256-.648.422-1.34.512c-.713.093-1.653.095-3.004.095h-.774c-1.35 0-2.29-.002-3.004-.095c-.692-.09-1.066-.256-1.34-.512c-.273-.256-.463-.618-.6-1.302c-.14-.706-.204-1.644-.294-2.992z"></path><path fill="currentColor" d="M9.425 10.254a.75.75 0 0 1 .821.671l.5 5a.75.75 0 0 1-1.492.15l-.5-5a.75.75 0 0 1 .671-.821m5.15 0a.75.75 0 0 1 .671.82l-.5 5a.75.75 0 0 1-1.492-.149l.5-5a.75.75 0 0 1 .82-.671"></path></svg>);
}


export function SolarPauseCircleBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10" opacity={0.3}></path><path fill="currentColor" d="M8.076 8.617C8 8.801 8 9.034 8 9.5v5c0 .466 0 .699.076.883a1 1 0 0 0 .541.54c.184.077.417.077.883.077s.699 0 .883-.076a1 1 0 0 0 .54-.541c.077-.184.077-.417.077-.883v-5c0-.466 0-.699-.076-.883a1 1 0 0 0-.541-.54C10.199 8 9.966 8 9.5 8s-.699 0-.883.076a1 1 0 0 0-.54.541m4.999 0C13 8.801 13 9.034 13 9.5v5c0 .466 0 .699.076.883a1 1 0 0 0 .541.54c.184.077.417.077.883.077s.699 0 .883-.076a1 1 0 0 0 .54-.541c.077-.184.077-.417.077-.883v-5c0-.466 0-.699-.076-.883a1 1 0 0 0-.541-.54C15.199 8 14.966 8 14.5 8s-.699 0-.883.076a1 1 0 0 0-.54.541"></path></svg>);
}


export function MdiDragVertical(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M9 3h2v2H9zm4 0h2v2h-2zM9 7h2v2H9zm4 0h2v2h-2zm-4 4h2v2H9zm4 0h2v2h-2zm-4 4h2v2H9zm4 0h2v2h-2zm-4 4h2v2H9zm4 0h2v2h-2z"></path></svg>);
}


export function SolarCalendarBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M6.94 2c.416 0 .753.324.753.724v1.46c.668-.012 1.417-.012 2.26-.012h4.015c.842 0 1.591 0 2.259.013v-1.46c0-.4.337-.725.753-.725s.753.324.753.724V4.25c1.445.111 2.394.384 3.09 1.055c.698.67.982 1.582 1.097 2.972L22 9H2v-.724c.116-1.39.4-2.302 1.097-2.972s1.645-.944 3.09-1.055V2.724c0-.4.337-.724.753-.724"></path><path fill="currentColor" d="M22 14v-2c0-.839-.004-2.335-.017-3H2.01c-.013.665-.01 2.161-.01 3v2c0 3.771 0 5.657 1.172 6.828S6.228 22 10 22h4c3.77 0 5.656 0 6.828-1.172S22 17.772 22 14" opacity={0.5}></path><path fill="currentColor" d="M18 17a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0"></path></svg>);
}


export function PhTerminalDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={256} height={256} viewBox="0 0 256 256" {...props}><g fill="currentColor"><path d="M216 80v112H40V64h160a16 16 0 0 1 16 16" opacity={0.2}></path><path d="m117.31 134l-72 64a8 8 0 1 1-10.63-12L100 128L34.69 70a8 8 0 1 1 10.63-12l72 64a8 8 0 0 1 0 12ZM216 184h-96a8 8 0 0 0 0 16h96a8 8 0 0 0 0-16"></path></g></svg>);
}

export function TablerPlant2(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4}><path d="M2 9a10 10 0 1 0 20 0"></path><path d="M12 19A10 10 0 0 1 22 9M2 9a10 10 0 0 1 10 10"></path><path d="M12 4a9.7 9.7 0 0 1 2.99 7.5m-5.98 0A9.7 9.7 0 0 1 12 4"></path></g></svg>);
}


export function PhSparkleDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={256} height={256} viewBox="0 0 256 256" {...props}><g fill="currentColor"><path d="m194.82 151.43l-55.09 20.3l-20.3 55.09a7.92 7.92 0 0 1-14.86 0l-20.3-55.09l-55.09-20.3a7.92 7.92 0 0 1 0-14.86l55.09-20.3l20.3-55.09a7.92 7.92 0 0 1 14.86 0l20.3 55.09l55.09 20.3a7.92 7.92 0 0 1 0 14.86" opacity={0.2}></path><path d="M197.58 129.06L146 110l-19-51.62a15.92 15.92 0 0 0-29.88 0L78 110l-51.62 19a15.92 15.92 0 0 0 0 29.88L78 178l19 51.62a15.92 15.92 0 0 0 29.88 0L146 178l51.62-19a15.92 15.92 0 0 0 0-29.88ZM137 164.22a8 8 0 0 0-4.74 4.74L112 223.85L91.78 169a8 8 0 0 0-4.78-4.78L32.15 144L87 123.78a8 8 0 0 0 4.78-4.78L112 64.15L132.22 119a8 8 0 0 0 4.74 4.74L191.85 144ZM144 40a8 8 0 0 1 8-8h16V16a8 8 0 0 1 16 0v16h16a8 8 0 0 1 0 16h-16v16a8 8 0 0 1-16 0V48h-16a8 8 0 0 1-8-8m104 48a8 8 0 0 1-8 8h-8v8a8 8 0 0 1-16 0v-8h-8a8 8 0 0 1 0-16h8v-8a8 8 0 0 1 16 0v8h8a8 8 0 0 1 8 8"></path></g></svg>);
}


export function SolarCrownStarBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="m21.838 11.126l-.229 2.436c-.378 4.012-.567 6.019-1.75 7.228C18.678 22 16.906 22 13.36 22h-2.72c-3.545 0-5.317 0-6.5-1.21s-1.371-3.216-1.749-7.228l-.23-2.436c-.18-1.912-.27-2.869.058-3.264a1 1 0 0 1 .675-.367c.476-.042 1.073.638 2.268 1.998c.618.704.927 1.055 1.271 1.11a.92.92 0 0 0 .562-.09c.319-.16.53-.595.955-1.464l2.237-4.584C10.989 2.822 11.39 2 12 2s1.011.822 1.813 2.465l2.237 4.584c.424.87.636 1.304.955 1.464c.176.089.37.12.562.09c.344-.055.653-.406 1.271-1.11c1.195-1.36 1.792-2.04 2.268-1.998a1 1 0 0 1 .675.367c.327.395.237 1.352.057 3.264" opacity={0.5}></path><path fill="currentColor" d="m12.952 12.699l-.098-.176c-.38-.682-.57-1.023-.854-1.023s-.474.34-.854 1.023l-.098.176c-.108.194-.162.29-.246.354c-.085.064-.19.088-.4.135l-.19.044c-.738.167-1.107.25-1.195.532s.164.577.667 1.165l.13.152c.143.167.215.25.247.354s.021.215 0 .438l-.02.203c-.076.785-.114 1.178.115 1.352c.23.174.576.015 1.267-.303l.178-.082c.197-.09.295-.136.399-.136s.202.046.399.136l.178.082c.691.319 1.037.477 1.267.303s.191-.567.115-1.352l-.02-.203c-.021-.223-.032-.334 0-.438s.104-.187.247-.354l.13-.152c.503-.588.755-.882.667-1.165c-.088-.282-.457-.365-1.195-.532l-.19-.044c-.21-.047-.315-.07-.4-.135c-.084-.064-.138-.16-.246-.354"></path></svg>);
}


export function FluentEmojiFlatCrown(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 32 32" {...props}><g fill="none"><path fill="#00a6ed" fillRule="evenodd" d="M6.94 23.5a1.58 1.58 0 1 1-3.16 0a1.58 1.58 0 0 1 3.16 0m21.26 0a1.58 1.58 0 1 1-3.16 0a1.58 1.58 0 0 1 3.16 0" clipRule="evenodd"></path><path fill="#e19747" fillRule="evenodd" d="m10.25 13.27l3.18 4.27l-6.59.76l2.12-4.89c-.51-.2-.87-.7-.87-1.28c0-.76.62-1.38 1.38-1.38a1.383 1.383 0 0 1 .78 2.52m12.76.14l2.12 4.89l-6.59-.76l3.18-4.27c-.36-.25-.6-.67-.6-1.14c0-.76.62-1.38 1.38-1.38s1.38.62 1.38 1.38c0 .58-.36 1.08-.87 1.28" clipRule="evenodd"></path><path fill="#ffb02e" d="M29.98 13.09c0-.76-.62-1.38-1.38-1.38s-1.38.62-1.38 1.38c0 .28.09.55.23.76c-.22 0-.44.05-.65.19l-3.93 2.54c-.52.33-1.2.21-1.57-.29l-4.37-5.93a.7.7 0 0 0-.11-.13a1.721 1.721 0 1 0-1.66 0c-.04.04-.08.08-.11.13l-4.37 5.93c-.36.5-1.05.62-1.57.29l-3.93-2.54c-.21-.14-.43-.19-.65-.19c.15-.22.23-.48.23-.76c0-.76-.62-1.38-1.38-1.38S2 12.33 2 13.09s.62 1.38 1.38 1.38c.05 0 .1 0 .14-.01c-.13.23-.18.5-.12.79L6 28.22c.19.93 1.01 1.6 1.96 1.6h16.06c.95 0 1.77-.67 1.96-1.6l2.6-12.97c.06-.29 0-.57-.12-.79c.05 0 .1.01.14.01c.76 0 1.38-.62 1.38-1.38"></path><path fill="#00a6ed" d="M15.99 26a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5"></path><path fill="#f8312f" fillRule="evenodd" d="M11 23.5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m13 0a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0" clipRule="evenodd"></path></g></svg>);
}

export function SiExpandMoreSquareDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeWidth={1.8}><path fill="currentColor" fillOpacity={0.25} strokeMiterlimit={10} d="M18.6 3H5.4A2.4 2.4 0 0 0 3 5.4v13.2A2.4 2.4 0 0 0 5.4 21h13.2a2.4 2.4 0 0 0 2.4-2.4V5.4A2.4 2.4 0 0 0 18.6 3Z"></path><path strokeLinecap="round" strokeLinejoin="round" d="m8 10l4 4l4-4"></path></g></svg>);
}


export function SiExpandMoreCircleDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeWidth={1.8}><path fill="currentColor" fillOpacity={0.16} strokeMiterlimit={10} d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10Z"></path><path strokeLinecap="round" strokeLinejoin="round" d="m8 10l4 4l4-4"></path></g></svg>);
}

export function MingcuteChartBarFill(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M13 3a2 2 0 0 1 1.995 1.85L15 5v16H9V5a2 2 0 0 1 1.85-1.995L11 3zm7 5a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-3V8zM7 11v10H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z"></path></g></svg>);
}


export function StreamlineFreehandMoneyCashBill(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="currentColor" fillRule="evenodd" clipRule="evenodd"><path d="M14.683 11.23a1.49 1.49 0 0 0-1.37-.69a2.8 2.8 0 0 0-.92.21c-.06-.15-.11-.31-.16-.47l-.18-.43a2.8 2.8 0 0 1 .84-.09a.38.38 0 0 0 .43-.32a.39.39 0 0 0-.32-.45a3.9 3.9 0 0 0-1.27 0c-.16-.41-.34-.83-.49-1.24a.38.38 0 0 0-.585-.222a.37.37 0 0 0-.146.391c.05.46.14.93.2 1.39q-.315.089-.61.23a1.66 1.66 0 0 0-.6 2.3a1.45 1.45 0 0 0 1.26.83a2.4 2.4 0 0 0 .75-.14l.12.31c.14.33.31.64.46 1a2.23 2.23 0 0 1-1.48.05a.42.42 0 0 0-.56.21a.42.42 0 0 0 .21.57c.725.3 1.53.34 2.28.11l.27.55a.43.43 0 0 0 .56.24a.42.42 0 0 0 .23-.58l-.15-.57q.327-.14.62-.34A2 2 0 0 0 15 11.976a2 2 0 0 0-.317-.747m-4.06 0c-.24-.35-.06-.65.24-.87c0 .1 0 .2.05.3s.1.39.16.59l-.18.06c-.1.02-.2.03-.27-.07zm2.52 2.09c-.07-.3-.15-.59-.23-.88l-.09-.32q.218-.095.45-.15c.1 0 .2 0 .26.06c.37.49.07.96-.39 1.3z"></path><path d="M22.733 9.49a18 18 0 0 0-.73-1.73a18 18 0 0 0-1-1.65a24.4 24.4 0 0 0-2.8-3.431a.36.36 0 0 0-.53 0a.33.33 0 0 0-.11.21a.41.41 0 0 0-.49 0a31 31 0 0 1-3.07 1.81a8.2 8.2 0 0 1-2.13.75c-1.57.182-3.152.239-4.73.17a9.2 9.2 0 0 0-2.14.37a8.3 8.3 0 0 0-2.16 1.11A13.7 13.7 0 0 0 .291 9.44a.4.4 0 0 0-.08.31a.37.37 0 0 0-.19.46c.38 1.27.7 2.59 1.13 3.89c.354 1.115.8 2.199 1.33 3.24a26.6 26.6 0 0 0 2.12 3.551a.41.41 0 0 0 .44.16a.38.38 0 0 0 .07.25a.39.39 0 0 0 .53.06a23.4 23.4 0 0 1 3-1.86a9.7 9.7 0 0 1 3.17-1.06a26 26 0 0 1 3.29-.32a19.5 19.5 0 0 0 3.451-.46a8.9 8.9 0 0 0 4.17-2.24a.43.43 0 0 0 .05-.6a.45.45 0 0 0-.61 0a8.33 8.33 0 0 1-3.85 1.71a27 27 0 0 1-3.29.21c-1.161.023-2.318.14-3.46.35a10.4 10.4 0 0 0-2.83 1.11a21 21 0 0 0-3.35 2.46a.5.5 0 0 0 0-.18a35 35 0 0 1-1.7-3.79c-.34-.85-.66-1.71-1-2.55c-.6-1.42-1.281-2.8-1.901-4.15h.09a13 13 0 0 1 2.13-1.71a7.3 7.3 0 0 1 2.36-1a9.3 9.3 0 0 1 2-.2h3.36a9 9 0 0 0 1.47-.25a9.6 9.6 0 0 0 2.39-1a33 33 0 0 0 3.001-2.201a.4.4 0 0 0 .12-.2a34 34 0 0 1 2.11 3.52c.29.53.57 1.06.85 1.6s.56 1.07.83 1.62a33 33 0 0 1 1.67 3.82a.43.43 0 0 0 .53.3a.43.43 0 0 0 .29-.53a26 26 0 0 0-1.25-4.27"></path><path d="M17.113 14.05a.42.42 0 0 0-.52.31a.42.42 0 0 0 .3.52c.61.154 1.25.154 1.86 0a9.2 9.2 0 0 0 2.47-1a1 1 0 0 0 .29-1a14.2 14.2 0 0 0-1.3-3.72a14.7 14.7 0 0 0-1.59-2.59a2.67 2.67 0 0 0-1.3-1a1.06 1.06 0 0 0-.76.23a7.05 7.05 0 0 1-2.56 1.68a.38.38 0 1 0 .15.74a4.7 4.7 0 0 0 1.49-.53a8 8 0 0 0 1.59-.83l.05.07c.294.38.552.79.77 1.22c.47.81 1 1.81 1.37 2.72q.425.908.75 1.86c0 .1.08.21.11.29a7.8 7.8 0 0 1-1.79.89c-.441.162-.916.21-1.38.14M5.152 9.93a5.1 5.1 0 0 1 1.75-.63a6 6 0 0 1 2-.06a.39.39 0 0 0 .44-.31a.38.38 0 0 0-.34-.44a7.3 7.3 0 0 0-2.24-.16a6.5 6.5 0 0 0-2.29.57a4.6 4.6 0 0 0-1.07.87a2.3 2.3 0 0 0-.54 1a1.9 1.9 0 0 0 0 .78q.083.42.21.83c.14.43.27.89.43 1.33s.34.89.54 1.33l1 2l.26.52a.66.66 0 0 0 .65.33c.28-.07.8-.59 1.68-1a4.8 4.8 0 0 1 1-.39a.43.43 0 1 0-.15-.84a6 6 0 0 0-1.3.35a6.4 6.4 0 0 0-1.09.61l-.84-2.07l-.85-2.52c-.05-.19-.12-.37-.17-.57a.9.9 0 0 1 0-.32c.05-.201.154-.385.3-.53q.276-.371.62-.68"></path></g></svg>);
}



export function GgArrowsExchange(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M4.993 12.984a1 1 0 0 0-.531 1.848L7.15 17.52a1 1 0 1 0 1.414-1.415l-1.121-1.12h7.55a1 1 0 0 0 0-2zm14.014-1.969a1 1 0 0 0 .531-1.848L16.85 6.48a1 1 0 0 0-1.414 1.415l1.121 1.12h-7.55a1 1 0 0 0 0 2z"></path></svg>);
}


export function SolarLockKeyholeBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M2 16c0-2.828 0-4.243.879-5.121C3.757 10 5.172 10 8 10h8c2.828 0 4.243 0 5.121.879C22 11.757 22 13.172 22 16s0 4.243-.879 5.121C20.243 22 18.828 22 16 22H8c-2.828 0-4.243 0-5.121-.879C2 20.243 2 18.828 2 16" opacity={0.5}></path><path fill="currentColor" d="M12 18a2 2 0 1 0 0-4a2 2 0 0 0 0 4M6.75 8a5.25 5.25 0 0 1 10.5 0v2.004c.567.005 1.064.018 1.5.05V8a6.75 6.75 0 0 0-13.5 0v2.055a24 24 0 0 1 1.5-.051z"></path></svg>);
} 


export function FluentPlugConnectedCheckmark20Filled(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" {...props}><path fill="currentColor" d="M17.78 3.28a.75.75 0 0 0-1.06-1.06l-2.446 2.445a4.04 4.04 0 0 0-5.128.481l-.3.3a1.49 1.49 0 0 0 0 2.108l2.465 2.464a5.51 5.51 0 0 1 4.552-.848a4.04 4.04 0 0 0-.528-3.444zM7.554 8.846l2.464 2.465a5.51 5.51 0 0 0-.848 4.552a4.04 4.04 0 0 1-3.444-.528L3.28 17.78a.75.75 0 0 1-1.06-1.06l2.446-2.446a4.04 4.04 0 0 1 .48-5.128l.3-.3a1.49 1.49 0 0 1 2.108 0M19 14.5a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0m-2.146-1.854a.5.5 0 0 0-.708 0L13.5 15.293l-.646-.647a.5.5 0 0 0-.708.708l1 1a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0 0-.708"></path></svg>);
}


export function FluentPlugDisconnected20Filled(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" {...props}><path fill="currentColor" d="M17.78 2.22a.75.75 0 0 1 0 1.06l-1.445 1.446a4.04 4.04 0 0 1-.481 5.127l-.3.3l-.003.003l-.309.309a1.05 1.05 0 0 1-1.484 0L9.535 6.242a1.05 1.05 0 0 1 0-1.485l.611-.61q.263-.262.557-.466a4.04 4.04 0 0 1 4.571-.016L16.72 2.22a.75.75 0 0 1 1.06 0m-9 6.25a.75.75 0 0 1 0 1.06l-1.27 1.272l1.69 1.69l1.27-1.272a.75.75 0 1 1 1.061 1.06l-1.276 1.277a1.49 1.49 0 0 1-.1 1.997l-.3.3a4.04 4.04 0 0 1-5.128.48L3.28 17.78a.75.75 0 0 1-1.06-1.06l1.445-1.446a4.04 4.04 0 0 1 .481-5.127l.3-.3a1.49 1.49 0 0 1 1.997-.1L7.72 8.47a.75.75 0 0 1 1.06 0"></path></svg>);
}


export function StreamlineUltimatePaperWrite(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}><path d="m13.05 19.14l-3.72.53l.53-3.67l9.55-9.54a2.25 2.25 0 0 1 3.18 3.18zM5.5.75h7s.75 0 .75.75V4s0 .75-.75.75h-7s-.75 0-.75-.75V1.5s0-.75.75-.75m7.75 2h2.5a1.5 1.5 0 0 1 1.5 1.5"></path><path d="M17.25 18.75v3a1.5 1.5 0 0 1-1.5 1.5H2.25a1.5 1.5 0 0 1-1.5-1.5V4.25a1.5 1.5 0 0 1 1.5-1.5h2.5m.5 6h7m-7 4.5h2.5"></path></g></svg>);
}

export function SolarPenNewSquareBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M1 12c0-5.185 0-7.778 1.61-9.39C4.223 1 6.816 1 12 1s7.778 0 9.39 1.61C23 4.223 23 6.816 23 12s0 7.778-1.61 9.39C19.777 23 17.184 23 12 23s-7.778 0-9.39-1.61C1 19.777 1 17.184 1 12" opacity={0.5}></path><path fill="currentColor" d="M13.926 14.302c.245-.191.467-.413.912-.858l5.54-5.54c.134-.134.073-.365-.106-.427a6.1 6.1 0 0 1-2.3-1.449a6.1 6.1 0 0 1-1.45-2.3c-.061-.18-.292-.24-.426-.106l-5.54 5.54c-.445.444-.667.667-.858.912a5 5 0 0 0-.577.932c-.133.28-.233.579-.431 1.175l-.257.77l-.409 1.226l-.382 1.148a.817.817 0 0 0 1.032 1.033l1.15-.383l1.224-.408l.77-.257c.597-.199.895-.298 1.175-.432q.498-.237.933-.576m8.187-8.132a3.028 3.028 0 0 0-4.282-4.283l-.179.178a.73.73 0 0 0-.206.651c.027.15.077.37.168.633a4.9 4.9 0 0 0 1.174 1.863a4.9 4.9 0 0 0 1.862 1.174c.263.09.483.141.633.168c.24.043.48-.035.652-.207z"></path></svg>);
}


export function CashCategory(props: SVGProps<SVGSVGElement>) {
	return (<svg
		viewBox="0 0 36 36"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		aria-hidden="true"
		role="img"
		className="iconify iconify--twemoji"
		preserveAspectRatio="xMidYMid meet"
		fill="#000000"
		width={26} height={26} {...props}
	  >
		<g id="SVGRepo_bgCarrier" strokeWidth={0} />
		<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
		<g id="SVGRepo_iconCarrier">
		  <path
			fill="#5C913B"
			d="M2 11c-2 0-2 2-2 2v21s0 2 2 2h32c2 0 2-2 2-2V13s0-2-2-2H2z"
		  />
		  <path
			fill="#A7D28B"
			d="M2 6C0 6 0 8 0 8v20s0 2 2 2h32c2 0 2-2 2-2V8s0-2-2-2H2z"
		  />
		  <circle fill="#77B255" cx={25} cy={18} r="6.5" />
		  <path
			fill="#5C913B"
			d="M33 28.5H3c-.827 0-1.5-.673-1.5-1.5V9c0-.827.673-1.5 1.5-1.5h30c.827 0 1.5.673 1.5 1.5v18c0 .827-.673 1.5-1.5 1.5zM3 8.5a.5.5 0 0 0-.5.5v18c0 .275.225.5.5.5h30c.275 0 .5-.225.5-.5V9a.5.5 0 0 0-.5-.5H3z"
		  />
		  <path fill="#FFE8B6" d="M14 6h8v24.062h-8z" />
		  <path fill="#5C913B" d="M14 30h8v6h-8z" />
		  <path
			fill="#5C913B"
			d="M11.81 20.023c0-2.979-5.493-2.785-5.493-4.584c0-.871.833-1.296 1.799-1.296c1.625 0 1.914 1.044 2.65 1.044c.521 0 .772-.328.772-.696c0-.856-1.296-1.502-2.539-1.726v-.825a.932.932 0 1 0-1.864 0v.853c-1.354.31-2.521 1.25-2.521 2.781c0 2.862 5.493 2.746 5.493 4.758c0 .695-.754 1.391-1.992 1.391c-1.857 0-2.476-1.257-3.229-1.257c-.368 0-.696.309-.696.775c0 .741 1.24 1.631 2.947 1.881l-.001.004v.934a.933.933 0 0 0 1.864 0v-.934c0-.01-.005-.019-.006-.028c1.535-.287 2.816-1.286 2.816-3.075z"
		  />
		</g>
	  </svg>
	  );
}



export function MdiPen(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M20.71 7.04c-.34.34-.67.67-.68 1c-.03.32.31.65.63.96c.48.5.95.95.93 1.44s-.53 1-1.04 1.5l-4.13 4.14L15 14.66l4.25-4.24l-.96-.96l-1.42 1.41l-3.75-3.75l3.84-3.83c.39-.39 1.04-.39 1.41 0l2.34 2.34c.39.37.39 1.02 0 1.41M3 17.25l9.56-9.57l3.75 3.75L6.75 21H3z"></path></svg>);
}


export function SolarShieldCrossBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M3 10.417c0-3.198 0-4.797.378-5.335c.377-.537 1.88-1.052 4.887-2.081l.573-.196C10.405 2.268 11.188 2 12 2s1.595.268 3.162.805l.573.196c3.007 1.029 4.51 1.544 4.887 2.081C21 5.62 21 7.22 21 10.417v1.574c0 5.638-4.239 8.375-6.899 9.536C13.38 21.842 13.02 22 12 22s-1.38-.158-2.101-.473C7.239 20.365 3 17.63 3 11.991z" opacity={0.5}></path><path fill="currentColor" d="M10.03 8.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.97 1.97a.75.75 0 1 0 1.06 1.06L12 13.06l1.97 1.97a.75.75 0 0 0 1.06-1.06L13.06 12l1.97-1.97a.75.75 0 1 0-1.06-1.06L12 10.94z"></path></svg>);
}

export function SiGridViewDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none"><path fill="currentColor" fillOpacity={0.16} d="M8.4 4H5.6A1.6 1.6 0 0 0 4 5.6v2.8A1.6 1.6 0 0 0 5.6 10h2.8A1.6 1.6 0 0 0 10 8.4V5.6A1.6 1.6 0 0 0 8.4 4m10 10h-2.8a1.6 1.6 0 0 0-1.6 1.6v2.8a1.6 1.6 0 0 0 1.6 1.6h2.8a1.6 1.6 0 0 0 1.6-1.6v-2.8a1.6 1.6 0 0 0-1.6-1.6"></path><path stroke="currentColor" strokeLinejoin="round" strokeMiterlimit={10} strokeWidth={1.8} d="M8.4 4H5.6A1.6 1.6 0 0 0 4 5.6v2.8A1.6 1.6 0 0 0 5.6 10h2.8A1.6 1.6 0 0 0 10 8.4V5.6A1.6 1.6 0 0 0 8.4 4Zm0 10H5.6A1.6 1.6 0 0 0 4 15.6v2.8A1.6 1.6 0 0 0 5.6 20h2.8a1.6 1.6 0 0 0 1.6-1.6v-2.8A1.6 1.6 0 0 0 8.4 14Zm10-10h-2.8A1.6 1.6 0 0 0 14 5.6v2.8a1.6 1.6 0 0 0 1.6 1.6h2.8A1.6 1.6 0 0 0 20 8.4V5.6A1.6 1.6 0 0 0 18.4 4Zm0 10h-2.8a1.6 1.6 0 0 0-1.6 1.6v2.8a1.6 1.6 0 0 0 1.6 1.6h2.8a1.6 1.6 0 0 0 1.6-1.6v-2.8a1.6 1.6 0 0 0-1.6-1.6Z"></path></g></svg>);
}


export function BasilEditOutline(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" fillRule="evenodd" d="M21.455 5.416a.75.75 0 0 1-.096.943l-9.193 9.192a.75.75 0 0 1-.34.195l-3.829 1a.75.75 0 0 1-.915-.915l1-3.828a.8.8 0 0 1 .161-.312L17.47 2.47a.75.75 0 0 1 1.06 0l2.829 2.828a1 1 0 0 1 .096.118m-1.687.412L18 4.061l-8.518 8.518l-.625 2.393l2.393-.625z" clipRule="evenodd"></path><path fill="currentColor" d="M19.641 17.16a44.4 44.4 0 0 0 .261-7.04a.4.4 0 0 1 .117-.3l.984-.984a.198.198 0 0 1 .338.127a46 46 0 0 1-.21 8.372c-.236 2.022-1.86 3.607-3.873 3.832a47.8 47.8 0 0 1-10.516 0c-2.012-.225-3.637-1.81-3.873-3.832a46 46 0 0 1 0-10.67c.236-2.022 1.86-3.607 3.873-3.832a48 48 0 0 1 7.989-.213a.2.2 0 0 1 .128.34l-.993.992a.4.4 0 0 1-.297.117a46 46 0 0 0-6.66.255a2.89 2.89 0 0 0-2.55 2.516a44.4 44.4 0 0 0 0 10.32a2.89 2.89 0 0 0 2.55 2.516c3.355.375 6.827.375 10.183 0a2.89 2.89 0 0 0 2.55-2.516"></path></svg>);
}


export function LetsIconsAddDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none"><circle cx={12} cy={12} r={9} fill="currentColor" fillOpacity={0.25}></circle><path stroke="currentColor" strokeLinecap="square" strokeLinejoin="round" strokeWidth={1.2} d="M12 8v8m4-4H8"></path></g></svg>);
}

export function MappLogo(props: SVGProps<SVGSVGElement>) {
	return (<svg
		id="Layer_2"
		data-name="Layer 2"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 108.89 73.35" {...props}
	  >
		<defs>
		  <style
			dangerouslySetInnerHTML={{
			  __html:
				"\n      .cls-1 {\n        fill: #fff;\n        stroke-width: 0px;\n      }\n    "
			}}
		  />
		</defs>
		<g id="Layer_1-2" data-name="Layer 1">
		  <polygon
			className="cls-1"
			points="108.89 10.48 108.89 52.39 72.59 73.35 72.59 52.39 54.44 62.87 36.29 52.39 36.29 73.35 0 52.39 0 10.48 18.15 20.96 18.15 0 54.44 20.96 90.74 0 90.74 20.96 108.89 10.48"
		  />
		</g>
	  </svg>);
}



export function GameIconsDeathStar(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={512} height={512} viewBox="0 0 512 512" {...props}><path fill="currentColor" d="M256 32C135.1 32 36.06 127.9 32.12 248.7c136.18 13.8 311.58 13.8 447.78 0c-.3-10.6-1.4-21.2-3.3-31.7H352v-18h32v-16h32v-16h45.6c-4.5-10.4-9.8-20.4-15.8-30H368v-18h48v-14h-18.7V89H368V73h-48V55h34.9c-30.8-15.14-64.6-23-98.9-23m-64.3 64h.3c35.3 0 64 28.7 64 64s-28.7 64-64 64s-64-28.7-64-64c0-35.2 28.5-63.83 63.7-64M32.26 266.7C37.97 386.1 136.4 480 256 480c10.6-1.4 16 0 43.8-7v-18h59c8.1-4.2 16-8.9 23.5-14H368v-16h-32v-18h85.4c8.5-9.3 16.3-19.4 23.1-30H432v-16h-80v-18h16v-16h48v-16h32v-16h28.5c1.7-9.4 2.7-18.8 3.2-28.3c-136.8 13.7-310.6 13.7-447.44 0"></path></svg>);
}


export function GameIconsTyre(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={512} height={512} viewBox="0 0 512 512" {...props}><path fill="currentColor" d="M128.844 16.313c-1.26.01-2.52.042-3.75.093c-19.69.814-35.63 6.786-46.625 17.782c-21.992 21.99-23.814 63.782-4.72 115.687s58.568 112.162 113.688 167.28c55.12 55.12 115.376 94.595 167.28 113.69c51.906 19.092 93.73 17.27 115.72-4.72s23.78-63.782 4.687-115.688c-19.094-51.905-58.54-112.195-113.656-167.312C306.35 88.008 246.06 48.563 194.155 29.47c-24.33-8.952-46.42-13.317-65.312-13.157zm34.97 52.156c45.347-.48 113.94 35.972 175.155 97.186c76.95 76.95 114.752 165.567 89.28 205c-16.348-55.695-56.743-120.148-115.438-178.844C254.13 133.127 189.692 92.728 134 76.376c8.06-5.202 18.167-7.784 29.813-7.906zM42.718 70.03L31.78 80.97c-10.986 10.987-16.853 26.35-17.686 46.06c-.834 19.712 3.62 43.48 13.219 69.376C46.508 248.202 86.06 308.372 141.156 363.47c55.097 55.096 115.267 94.646 167.063 113.842c25.896 9.6 49.663 14.052 69.374 13.22c19.71-.834 35.076-6.702 46.062-17.688l10.97-10.97c-25.293 3.142-55.017-1.975-86.345-13.5c-55.3-20.342-117.292-61.23-174.06-118c-56.77-56.768-97.658-118.728-118-174.03c-11.516-31.302-16.626-61.026-13.5-86.313zm77.218 21.876c52.77 13.2 119.523 52.99 179.656 113.125c60.133 60.136 99.926 126.892 113.125 179.657c-41.025 21.154-126.707-16.642-201.408-91.343c-74.715-74.716-112.55-160.424-91.375-201.438z"></path></svg>);
}


export function GameIconsSonicBoom(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={512} height={512} viewBox="0 0 512 512" {...props}><path fill="currentColor" d="M255.594 19.32a238 238 0 0 0-55.256 6.703l29.64 62.618a189.5 189.5 0 0 1 46.448-3.445zm47.213 4.502l13.277 67.563c80.478 21.548 139.744 94.97 139.744 182.242c0 104.193-84.466 188.66-188.66 188.66c-86.638 0-159.628-58.404-181.768-137.986l-60.023-15.71C49.16 414.368 143.55 493.268 256.567 493.268c130.99 0 236.98-105.99 236.98-236.98c0-115.16-81.928-210.986-190.74-232.466M154.137 42.49a237 237 0 0 0-52.9 34.748l44.482 52.03a188.7 188.7 0 0 1 44.897-28.112l-36.48-58.666zM68.89 111.51a236.6 236.6 0 0 0-30.1 51.12l54.462 37.765a188.5 188.5 0 0 1 24.963-42.55zm209.737 52.97c-4.208 0-8.368.204-12.475.59l32.12 67.866a84.2 84.2 0 0 1 26.822 6.17l-22.934-72.53a132.5 132.5 0 0 0-23.533-2.097zM234.67 172a131.4 131.4 0 0 0-35.83 19.398l47.36 55.393c8.293-5.49 17.6-9.572 27.593-11.873zm98.055 4.066l15.125 76.973c14.87 12.698 25.3 30.44 28.62 50.585c12.203 6.997 22.144 17.516 28.41 30.164a131.7 131.7 0 0 0 5.452-37.606c0-53.457-31.85-99.475-77.607-120.116M24.505 207.99a238.6 238.6 0 0 0-4.92 48.297c0 1.402.03 2.8.054 4.196L78.76 283.46a192 192 0 0 1-.254-9.833c0-11.836 1.1-23.413 3.185-34.645l-57.187-30.99zm152.192 4.785a131.7 131.7 0 0 0-19.383 32.04l57.448 39.837c3.517-8.36 8.352-16.023 14.22-22.763l-52.285-49.113zm-28.11 62.453a132.8 132.8 0 0 0-.919 35.004l62.19 24.164a85 85 0 0 1-1.692-16.92c0-3.268.19-6.49.55-9.664L148.59 275.23zm192.854 37.745a51.93 51.93 0 0 0-52.07 52.07a51.93 51.93 0 0 0 52.07 52.07a51.93 51.93 0 0 0 52.072-52.07a51.93 51.93 0 0 0-52.07-52.07zM155.35 342.61c18.774 49.828 66.883 85.28 123.28 85.28c8.855 0 17.505-.88 25.87-2.548a71.45 71.45 0 0 1-23.756-24.018c-26.384-3.79-48.834-19.743-61.506-41.992l-63.888-16.723z"></path></svg>);
}


export function GameIconsPlatform(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={512} height={512} viewBox="0 0 512 512" {...props}><path fill="currentColor" d="m318 123.645l-61.5 35.7l-61.76-35.7l61.76-35.7zm93.68 54.19l-61.76 35.7l61.76 35.7l61.5-35.7zm-294.39 80.64l61.76 35.7l61.5-35.7l-61.5-35.7zm139.52-80.57l-61.76 35.7l61.76 35.7l61.5-35.7zM31 298.365l62 35.69v-71l-62-35.65v71zm373-26l-62 35.69v70.94l62-35.66zm-225.11-139.4l-61.76 35.7l61.76 35.7l61.5-35.7zM109 343.305l62 35.69v-70.94l-62-35.69v71zm225.41-120.45l-61.76 35.7l61.76 35.7l61.5-35.7zM249 353.055l-62-35.7v71l62 35.7zm77-35.67l-61 35.67v70.94l61-35.66zm8.07-184.5l-61.76 35.7l61.76 35.7l61.5-35.7zm-232.6 44.95l-61.77 35.7l61.76 35.7l61.5-35.7zM481 227.565l-61 35.66v70.94l61-35.66zm-286.11 75.93l61.76 35.7l61.5-35.7l-61.5-35.7z"></path></svg>);
}

 
export function GameIconsMetalDisc(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={512} height={512} viewBox="0 0 512 512" {...props}><path fill="currentColor" d="M279.53 17.594c-25.88 0-50.532 7.233-72.874 20.375L440.75 249.155c.064 2.51.125 5.03.125 7.563c0 48.374-11.77 92.984-31.375 128.905L126.656 130.5c18.283-38.372 48.536-73.165 79.97-92.53l-4.75-3.907h-23c-26.634 21.17-51.19 50.724-67.657 85.374l2.968.032l12.343 11.124a272 272 0 0 0-12.905 33.125l277.438 250.25c-7.94 10.24-16.614 19.337-25.875 27.155L103.78 205.345c2.375-14.753 6.394-29.394 9.782-41.72L109 159.5H95.406c-3.734 12.13-6.807 24.154-9.125 37.094h7.69l9.78 8.844c-1.135 7.016-2.067 14.14-2.72 21.375l249.626 225.156c-10.244 6.75-21.046 12.017-32.312 15.655l-218.156-196.75c3.004 59.868 22.88 113.578 53.062 152.97c32.824 42.835 77.36 68.624 126.28 68.624c6.896 0 13.707-.53 20.408-1.533l.5-.062c.335-.05.665-.102 1-.156c41.91-6.194 79.226-31.575 106.812-68.533c31.904-42.742 51.312-101.145 51.313-165.468a310 310 0 0 0-4.437-52.408c-7.573-45.756-25.125-86.527-49.313-118.093c-32.823-42.838-77.36-68.626-126.28-68.626zm-76.092.812c-17.844 1.912-34.983 7.274-51.032 15.625h26.72c7.77-5.878 15.89-11.115 24.31-15.624zm-132.72 101c-6.665 12.61-12.44 26.114-17.187 40.375h41.72c4.374-14.114 9.698-27.613 15.875-40.374H70.72zm-26.78 77.03c-1.885 9.768-3.286 19.787-4.22 30h42.594c.874-10.188 2.2-20.2 3.97-30H43.937zm38.5 30.19c-1.088 11.86-1.082 21.727-1.344 32.343H38.438c.8 64.638 21.266 122.89 53.437 164.874c29.497 38.495 68.465 63.195 111.563 67.812c-24.67-13.206-46.746-32.573-65.032-56.437c-34.936-45.595-56.473-107.688-57.28-176.19h5.624l13.313 11.69c-1.658-13.463-.116-30.614 1.093-43.5l-.656-.595H82.437z"></path></svg>);
}

export function GameIconsIceCube(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={512} height={512} viewBox="0 0 512 512" {...props}><path fill="currentColor" d="M238.406 26.844c-9.653.12-18.926 2.69-30.437 7.062l-157.282 57c-20.984 7.65-21.587 11.834-22.344 33.28L20.937 358.22c-1.207 27.514-.654 33.187 23.25 43.56l185.783 81.41c19.34 8.29 31.906 7.655 45.186 3.218l181.938-56.53c21.95-7.295 25.04-9.627 25.875-36.845l7.686-250.155c.662-17.37-5.667-24.695-18.78-29.625L271.062 34.375c-12.977-5.344-23.003-7.653-32.657-7.53zm.813 24.875c23.637-.053 45.564 8.434 87.874 24.874c95.545 37.123 131.71 53.8 69.687 77.937c-74.002 28.802-128.175 45.115-172.28 25.814L113.47 131.75c-34.57-15.127-44.69-27.46 17.843-50.094c55.64-20.14 82.742-29.882 107.906-29.937m44.718 43.75c-38.284.402-55.285 21.205-56.813 38.936c-.873 10.132 2.95 19.6 12.406 26.25s25.355 10.56 48.97 5.938c35.817-7.01 61.536-15.056 77.5-22.844c7.982-3.894 13.464-7.737 16.5-10.844s3.453-4.942 3.438-6c-.016-1.057-.44-2.675-3.313-5.406s-8.03-6.04-15.22-9.156c-14.378-6.233-36.757-11.877-65.717-15.72c-6.355-.842-12.28-1.213-17.75-1.155zM59.25 134c10.372-.29 29.217 7.2 63.906 22.656c140.925 62.786 140.52 65.876 130.97 200.656c-7.783 109.81-8.797 109.85-128.47 59.282c-73.15-30.91-86.806-40.853-85.187-88.97l5.468-162.937c.674-20.034 1.557-30.358 13.312-30.687zm381.938 30.906c29.172-.384 29.1 28.075 26.75 105.25c-4.118 135.132-9.05 140.184-120.375 173.72c-70.42 21.21-81.49 25.614-78.97-12.032l11-164.156c3.217-48.034 7.588-51.508 94.813-83.907c31.323-11.633 52.534-18.686 66.78-18.874zm-20.438 40.688c-.332-.002-.674.015-1 .03c-5.22.263-10.226 2.77-14.188 8.407c-3.96 5.638-6.81 14.71-5.687 27.907c1.448 17.033-4.507 38.11-15.156 56.938c-10.65 18.827-26.502 35.91-47.814 38.813c-29.127 3.968-42.41 23.58-43.5 42.062c-.545 9.24 2.108 18.03 7.688 24.594s14.088 11.335 27.187 12.03c41.146 2.185 71.336-10.766 91.595-39.155c20.26-28.39 30.396-73.76 25.875-136.595c-1.876-26.076-14.708-34.977-25-35.03zm-246.25 8.844q-.966 0-1.72.187c-2.003.494-3.685 1.53-5.655 4.813c-1.913 3.186-3.688 8.618-4.406 16.343l-.064.657c-1.388 16.732-8.098 28.602-17.844 35.063c-9.745 6.46-20.794 7.808-31.125 9.094s-20.177 2.39-28.156 5.75c-7.977 3.36-14.36 8.38-19.468 19.78c-7.2 16.076-7.143 28.027-3.124 38.563c4.018 10.537 12.688 20.106 24.687 28.75c23.998 17.29 60.27 29.956 88.906 41.844c11.386 4.727 20.496 6.484 27.282 6.126s11.278-2.423 15.375-6.562c8.195-8.28 14.057-27.692 15-57.344c2.024-63.623-18.84-110.284-38.656-130.875c-8.668-9.008-16.52-12.193-21.03-12.188zm184.22 6.812c-.95-.003-1.927.035-2.97.094c-35.464 1.99-48.477 12.867-52.5 24.062s.826 27.07 10.844 39.78c11.488 14.58 20.59 15.736 30.437 12.283c9.848-3.455 20.542-14.108 27.376-26.908s9.512-27.397 7.188-36.28c-1.163-4.443-3.144-7.422-6.47-9.626c-2.908-1.928-7.274-3.388-13.905-3.406z"></path></svg>);
}


export function GameIconsHops(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={512} height={512} viewBox="0 0 512 512" {...props}><path fill="currentColor" d="M455.016 31.335c-7.352 27.563-11.672 51.534-29.666 70.475a132 132 0 0 1 10.89 14.457c21.859-21.479 31.27-55.32 36.444-81.483zm-365.77 86.553c26.53 23.311 75.437 43.214 128.588 50.441c8.93-54.446 25.763-101.262 78.663-111.742c-87.441-32.988-169.736-14.856-207.25 61.3zm181.012-30.992c-23.32 17.537-33.49 55.18-35.172 93.896c-1.561 35.96 3.991 71.655 9.075 90.1c18.466 5.08 54.205 10.628 90.213 9.068c38.762-1.68 76.457-11.845 94.011-35.137c26.195-44.685 11.365-102.657-21.504-136.447c-35.854-30.649-96.195-50.896-136.623-21.48M93.756 144.06c-21.448 19.766-37.77 47.077-44.715 84.466c29.077 14.704 53.089 19.928 81.481 23.61c19.863-23.625 28.623-48.967 39.228-75.043c-29.084-7.861-55.342-19.184-75.994-33.033m93.71 37.314c-13.41 45.213-43.135 138.013-19.993 166.121c20.996 20.505 122.712-2.301 166.324-19.967a360 360 0 0 1-5.027-29.386c-33.203-1.003-67.74-2.657-99.18-12.67c-8.98-34.162-13.172-70.091-12.685-99.073a360 360 0 0 1-29.44-5.025zm271.243 37.24c-9.797 53.078-68.758 74.708-111.867 78.6c7.237 53.09 27.16 101.938 50.498 128.433c85.392-40.18 90.077-136.087 61.37-207.033zM59.217 254.495c-13.823 25.304-23.43 57.957-25.054 84.063c16.933 5.432 36.996 6.918 53.347 7.308c6.387-25.338 18.476-51.542 32.994-76.928c-20.58-3.495-43.292-7.486-61.287-14.443m88.59 3.938c-22.603 45.341-56.073 107.837-42.664 151.328c57.858 6.862 111.673-17.601 151.47-42.592c-32.613 5.741-81.751 15.043-103.86-4.938c-18.09-28.865-13.015-58.231-4.946-103.798m190.277 86.802c-30.287 7.312-51.234 24.35-75.14 39.196c4.16 25.089 9.576 60.967 23.635 81.375c37.436-6.937 64.779-23.24 84.568-44.662c-13.862-20.63-25.194-46.859-33.063-75.909M46.331 360.267c-10.174 36.445-17.91 81.317-4.399 112.632c31.358 13.502 76.288 5.774 112.777-4.39c-2.03-12.867-3.194-26.613-3.529-37.592c-23.234 1.407-41.295.55-59.984-7.201c-7.773-19.583-9.502-42.678-7.215-59.922c-13.049-.685-25.974-1.445-37.65-3.527m199.806 34.162c-25.42 14.508-51.66 26.588-77.03 32.968c.398 20.603.666 38.958 7.315 53.268c31-3.247 58.572-10.692 84.17-25.025c-7.523-22.172-11.492-40.957-14.455-61.211"></path></svg>);
}


export function GameIconsFairyWingsaa(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={512} height={512} viewBox="0 0 512 512" {...props}><path fill="currentColor" d="M152 25c-16.8 0-28 3.51-35.2 8.64c-7.3 5.14-11.1 11.95-12.7 21.34c-3.1 18.79 5.3 47.62 21.7 76.62c14.9 26.2 35.9 52.6 58.5 73.6c18.5 12.7 38.4 25.1 60.1 35.6c-25.1-45.3-38.9-96.8-51-138.3c-7-23.9-13.5-44.59-20.6-58.37c-3.6-6.89-7.3-11.96-10.8-14.98c-3.4-3.01-6.2-4.15-10-4.15m208 0c-3.8 0-6.6 1.14-10 4.15c-3.5 3.02-7.2 8.09-10.8 14.98c-7.1 13.78-13.6 34.47-20.6 58.37c-12.1 41.5-25.9 93-51 138.3c21.7-10.5 41.6-22.9 60.1-35.6c22.6-21 43.6-47.4 58.5-73.6c16.4-29 24.8-57.83 21.7-76.62c-1.6-9.39-5.4-16.2-12.7-21.34C388 28.51 376.8 25 360 25M51.17 139.9c-3.33.1-6.23 1.1-9.03 2.9c-11.19 11.8-17.01 22.5-19.03 31.8c-2.07 9.5-.58 17.8 3.91 26c8.99 16.5 31.6 32.1 60.12 43.1c22.16 8.5 47.66 14.3 72.16 16.9c23.1-3 46.1-5.8 67-8.8c-45.3-23.8-82.6-54-112.8-77c-17.83-13.7-33.31-24.8-45.61-30.4c-6.15-2.8-11.05-4.3-15.26-4.5zm408.23 0c-4.2.2-9.1 1.7-15.3 4.5c-12.3 5.6-27.8 16.7-45.6 30.4c-30.2 23-67.5 53.2-112.8 77c20.9 3 43.9 5.8 67 8.8c24.5-2.6 50-8.4 72.2-16.9c28.5-11 51.1-26.6 60.1-43.1c4.5-8.2 6-16.5 3.9-26c-2-9.3-7.9-20-19-31.8c-2.8-1.8-5.8-2.8-9.1-2.9zM243.3 267.2c-41.1 6.7-91.6 11.5-134.6 19.3c-24.01 4.3-45.47 9.7-60.74 16.4s-23.08 14.2-24.53 21.5c-2.82 14.4-1.5 24.5 1.9 31.5c3.41 6.9 8.94 11.4 17.35 14.4c16.84 5.9 44.94 3.4 74.52-6.4c4-1.3 8.1-2.8 12.1-4.4c38.5-28.5 81.1-58.1 110.2-84.3c1.4-2.7 2.7-5.4 3.8-8m25.4 0c1.1 2.6 2.4 5.3 3.8 8c29.1 26.2 71.7 55.8 110.2 84.3c4 1.6 8.1 3.1 12.1 4.4c29.6 9.8 57.7 12.3 74.5 6.4c8.4-3 14-7.5 17.4-14.4c3.4-7 4.7-17.1 1.9-31.5c-1.5-7.3-9.3-14.8-24.6-21.5c-15.2-6.7-36.7-12.1-60.7-16.4c-43-7.8-93.5-12.6-134.6-19.3m-21.1 24.9c-33.2 29.3-78.9 60.2-117.6 89.4c-22.4 17-42.43 33.3-55.78 47.7c-13.34 14.5-18.69 26.4-17.39 33.1c2.83 14.3 7.86 22.6 13.45 27.1c5.6 4.4 12.33 5.9 21.52 4.4c18.4-2.8 44.5-19 69.2-43.1c24.7-24.2 48.4-55.8 64.7-87.9c12.5-24.5 20.4-49.2 21.9-70.7m16.8 0c1.5 21.5 9.4 46.2 21.9 70.7c16.3 32.1 40 63.7 64.7 87.9c24.7 24.1 50.8 40.3 69.2 43.1c9.2 1.5 15.9 0 21.5-4.4c5.6-4.5 10.6-12.8 13.5-27.1c1.3-6.7-4.1-18.6-17.4-33.1c-13.4-14.4-33.4-30.7-55.8-47.7c-38.7-29.2-84.4-60.1-117.6-89.4"></path></svg>);
}


export function GameIconsFairyWings(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className="group w-32 h-32 group-hover:w-30 group-hover:h-30"
      {...props}
    >
      {/* LEFT UPPER */}
      <path
        className="transition-transform duration-300 ease-out
                    "
        fill="currentColor"
        d="M152 25c-16.8 0-28 3.51-35.2 8.64c-7.3 5.14-11.1 11.95-12.7 21.34c-3.1 18.79 5.3 47.62 21.7 76.62c14.9 26.2 35.9 52.6 58.5 73.6c18.5 12.7 38.4 25.1 60.1 35.6c-25.1-45.3-38.9-96.8-51-138.3c-7-23.9-13.5-44.59-20.6-58.37c-3.6-6.89-7.3-11.96-10.8-14.98c-3.4-3.01-6.2-4.15-10-4.15"
      />

      {/* RIGHT UPPER */}
      <path
        className="transition-transform duration-300 ease-out
                   "
        fill="currentColor"
        d="M360 25c-3.8 0-6.6 1.14-10 4.15c-3.5 3.02-7.2 8.09-10.8 14.98c-7.1 13.78-13.6 34.47-20.6 58.37c-12.1 41.5-25.9 93-51 138.3c21.7-10.5 41.6-22.9 60.1-35.6c22.6-21 43.6-47.4 58.5-73.6c16.4-29 24.8-57.83 21.7-76.62c-1.6-9.39-5.4-16.2-12.7-21.34C388 28.51 376.8 25 360 25"
      />

      {/* LEFT MID */}
      <path
        className="transition-transform duration-300 delay-75 ease-out
                   "
        fill="currentColor"
        d="M51.17 139.9c-3.33.1-6.23 1.1-9.03 2.9c-11.19 11.8-17.01 22.5-19.03 31.8c-2.07 9.5-.58 17.8 3.91 26c8.99 16.5 31.6 32.1 60.12 43.1c22.16 8.5 47.66 14.3 72.16 16.9c23.1-3 46.1-5.8 67-8.8c-45.3-23.8-82.6-54-112.8-77c-17.83-13.7-33.31-24.8-45.61-30.4c-6.15-2.8-11.05-4.3-15.26-4.5"
      />

      {/* RIGHT MID */}
      <path
        className="transition-transform duration-300 delay-75 ease-out
                   "
        fill="currentColor"
        d="M459.4 139.9c-4.2.2-9.1 1.7-15.3 4.5c-12.3 5.6-27.8 16.7-45.6 30.4c-30.2 23-67.5 53.2-112.8 77c20.9 3 43.9 5.8 67 8.8c24.5-2.6 50-8.4 72.2-16.9c28.5-11 51.1-26.6 60.1-43.1c4.5-8.2 6-16.5 3.9-26c-2-9.3-7.9-20-19-31.8c-2.8-1.8-5.8-2.8-9.1-2.9"
      />

      {/* LEFT LOWER OUTER */}
      <path
        className="transition-transform duration-300 delay-100 ease-out
                  "
        fill="currentColor"
        d="M243.3 267.2c-41.1 6.7-91.6 11.5-134.6 19.3c-24.01 4.3-45.47 9.7-60.74 16.4s-23.08 14.2-24.53 21.5c-2.82 14.4-1.5 24.5 1.9 31.5c3.41 6.9 8.94 11.4 17.35 14.4c16.84 5.9 44.94 3.4 74.52-6.4c4-1.3 8.1-2.8 12.1-4.4c38.5-28.5 81.1-58.1 110.2-84.3c1.4-2.7 2.7-5.4 3.8-8"
      />

      {/* RIGHT LOWER OUTER */}
      <path
        className="transition-transform duration-300 delay-100 ease-out
                  "
        fill="currentColor"
        d="M268.7 267.2c1.1 2.6 2.4 5.3 3.8 8c29.1 26.2 71.7 55.8 110.2 84.3c4 1.6 8.1 3.1 12.1 4.4c29.6 9.8 57.7 12.3 74.5 6.4c8.4-3 14-7.5 17.4-14.4c3.4-7 4.7-17.1 1.9-31.5c-1.5-7.3-9.3-14.8-24.6-21.5c-15.2-6.7-36.7-12.1-60.7-16.4c-43-7.8-93.5-12.6-134.6-19.3"
      />

      {/* LEFT INNER TAIL */}
      <path
        className="transition-transform duration-300 delay-150 ease-out
                  "
        fill="currentColor"
        d="M247.6 292.1c-33.2 29.3-78.9 60.2-117.6 89.4c-22.4 17-42.43 33.3-55.78 47.7c-13.34 14.5-18.69 26.4-17.39 33.1c2.83 14.3 7.86 22.6 13.45 27.1c5.6 4.4 12.33 5.9 21.52 4.4c18.4-2.8 44.5-19 69.2-43.1c24.7-24.2 48.4-55.8 64.7-87.9c12.5-24.5 20.4-49.2 21.9-70.7"
      />

      {/* RIGHT INNER TAIL */}
      <path
        className="transition-transform duration-300 delay-150 ease-out
              "
        fill="currentColor"
        d="M264.4 292.1c1.5 21.5 9.4 46.2 21.9 70.7c16.3 32.1 40 63.7 64.7 87.9c24.7 24.1 50.8 40.3 69.2 43.1c9.2 1.5 15.9 0 21.5-4.4c5.6-4.5 10.6-12.8 13.5-27.1c1.3-6.7-4.1-18.6-17.4-33.1c-13.4-14.4-33.4-30.7-55.8-47.7c-38.7-29.2-84.4-60.1-117.6-89.4"
      />
    </svg>
  );
}


export function LogoMapprss(props: SVGProps<SVGSVGElement>) {
	return (<svg
		width="256px"
		height="256px"
		viewBox="0 0 24.00 24.00"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		stroke="#ac5f20"
		strokeWidth="0.12000000000000002"
		{...props}
	  >
		<g id="SVGRepo_bgCarrier" strokeWidth={0} />
		<g
		  id="SVGRepo_tracerCarrier"
		  strokeLinecap="round"
		  strokeLinejoin="round"
		  stroke="#CCCCCC"
		  strokeWidth="0.144"
		/>
		<g id="SVGRepo_iconCarrier">
		  {" "}
		  <path
			d="M12.4996 17.5298C12.3596 17.6798 12.1696 17.7498 11.9696 17.7498C11.7796 17.7498 11.5896 17.6798 11.4396 17.5298L9.84961 15.9398C10.4396 15.8698 11.0096 15.7298 11.5396 15.5098L12.4996 16.4698C12.7996 16.7598 12.7996 17.2398 12.4996 17.5298Z"
			fill="#d07016"
		  />{" "}
		  <path
			d="M15.9591 15.9301C15.8191 16.0801 15.6191 16.1601 15.4291 16.1601C15.2391 16.1601 15.0491 16.0801 14.8991 15.9401L13.3691 14.4401C13.7591 14.1301 14.1191 13.7701 14.4291 13.3701L15.9491 14.8701C16.2491 15.1601 16.2491 15.6401 15.9591 15.9301Z"
			fill="#d07016"
		  />{" "}
		  <path
			d="M17.5005 12.5299C17.3605 12.6799 17.1705 12.7499 16.9705 12.7499C16.7805 12.7499 16.5905 12.6799 16.4405 12.5299L15.4805 11.5699C15.7005 11.0399 15.8405 10.4699 15.9105 9.87988L17.5005 11.4699C17.8005 11.7599 17.8005 12.2399 17.5005 12.5299Z"
			fill="#d07016"
		  />{" "}
		  <path
			d="M15.9007 8.07C15.4507 4.64 12.5207 2 8.9707 2C5.1007 2 1.9707 5.13 1.9707 9C1.9707 12.55 4.6107 15.48 8.0407 15.93C8.3407 15.98 8.6507 16 8.9707 16C9.2707 16 9.5607 15.98 9.8507 15.94L9.4707 15.56C9.1807 15.26 9.1807 14.79 9.4707 14.5C9.7607 14.2 10.2407 14.2 10.5307 14.5L11.5407 15.51C12.2107 15.25 12.8207 14.89 13.3707 14.44L12.4707 13.55C12.1807 13.26 12.1707 12.79 12.4707 12.49C12.7607 12.2 13.2307 12.19 13.5307 12.48L14.4307 13.37C14.8707 12.83 15.2307 12.23 15.4807 11.57L14.4707 10.56C14.1807 10.26 14.1807 9.79 14.4707 9.5C14.7607 9.2 15.2407 9.2 15.5307 9.5L15.9107 9.88C15.9507 9.59 15.9707 9.3 15.9707 9C15.9707 8.68 15.9507 8.37 15.9007 8.07Z"
			fill="#d07016"
		  />{" "}
		  <path
			opacity="0.4"
			d="M21.9691 14.9998C21.9691 18.8698 18.8391 21.9998 14.9691 21.9998C11.4191 21.9998 8.48906 19.3598 8.03906 15.9298C8.33906 15.9798 8.64906 15.9998 8.96906 15.9998C9.26906 15.9998 9.55906 15.9798 9.84906 15.9398L11.4391 17.5298C11.5891 17.6798 11.7791 17.7498 11.9691 17.7498C12.1691 17.7498 12.3591 17.6798 12.4991 17.5298C12.7991 17.2398 12.7991 16.7598 12.4991 16.4698L11.5391 15.5098C12.2091 15.2498 12.8191 14.8898 13.3691 14.4398L14.8991 15.9398C15.0491 16.0798 15.2391 16.1598 15.4291 16.1598C15.6191 16.1598 15.8191 16.0798 15.9591 15.9298C16.2491 15.6398 16.2491 15.1598 15.9491 14.8698L14.4291 13.3698C14.8691 12.8298 15.2291 12.2298 15.4791 11.5698L16.4391 12.5298C16.5891 12.6798 16.7791 12.7498 16.9691 12.7498C17.1691 12.7498 17.3591 12.6798 17.4991 12.5298C17.7991 12.2398 17.7991 11.7598 17.4991 11.4698L15.9091 9.87982C15.9491 9.58982 15.9691 9.29982 15.9691 8.99982C15.9691 8.67982 15.9491 8.36982 15.8991 8.06982C19.3291 8.51982 21.9691 11.4498 21.9691 14.9998Z"
			fill="#d07016"
		  />{" "}
		</g>
	  </svg>
	  );
  }
  
  export function LogoMapprsss(props: SVGProps<SVGSVGElement>) {
	return (<svg
		version="1.1"
		id="Uploaded to svgrepo.com"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		viewBox="0 0 32 32"
		xmlSpace="preserve"
		fill="#000000"
		{...props}
	  >
		<g id="SVGRepo_bgCarrier" strokeWidth={0} />
		<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
		<g id="SVGRepo_iconCarrier">
		  {" "}
		  <style
			type="text/css"
			dangerouslySetInnerHTML={{
			  __html:
				" .cubies_twaalf{fill:#FFF2DF;} .cubies_een{fill:#4C4842;} .cubies_vijftien{fill:#D1DE8B;} .cubies_dertien{fill:#A4C83F;} .cubies_veertien{fill:#BCD269;} .st0{fill:#F2C99E;} .st1{fill:#F9E0BD;} .st2{fill:#C9483A;} .st3{fill:#D97360;} .st4{fill:#65C3AB;} .st5{fill:#EDB57E;} .st6{fill:#98D3BC;} .st7{fill:#E3D4C0;} .st8{fill:#CCE2CD;} .st9{fill:#67625D;} .st10{fill:#EDEAE5;} .st11{fill:#C9C6C0;} .st12{fill:#837F79;} .st13{fill:#EC9B5A;} .st14{fill:#2EB39A;} .st15{fill:#725A48;} .st16{fill:#8E7866;} .st17{fill:#E69D8A;} .st18{fill:#A5A29C;} .st19{fill:#E8E8B5;} "
			}}
		  />{" "}
		  <g>
			{" "}
			<path
			  className="cubies_dertien"
			  d="M29,0h-2c-1.657,0-3,1.343-3,3H8c0-1.657-1.343-3-3-3H3C1.343,0,0,1.343,0,3v26 c0,1.657,1.343,3,3,3h26c1.657,0,3-1.343,3-3V3C32,1.343,30.657,0,29,0z"
			/>{" "}
			<path
			  className="cubies_veertien"
			  d="M27,0c-1.657,0-3,1.343-3,3H6c0-1.657-1.343-3-3-3S0,1.343,0,3v26c0,1.657,1.343,3,3,3h24 c1.657,0,3-1.343,3-3V3C30,1.343,28.657,0,27,0z"
			/>{" "}
			<path
			  className="cubies_dertien"
			  d="M24,19c0-1.657,1.343-3,3-3h1c1.657,0,3,1.343,3,3s-1.343,3-3,3h-1C25.343,22,24,20.657,24,19z M4,26H3c-1.657,0-3,1.343-3,3s1.343,3,3,3h1c1.657,0,3-1.343,3-3S5.657,26,4,26z M16,10h-1c-2.209,0-4,1.791-4,4 c0,2.209,1.791,4,4,4h1c2.209,0,4-1.791,4-4C20,11.791,18.209,10,16,10z M28,26h-1c-1.657,0-3,1.343-3,3s1.343,3,3,3h1 c1.657,0,3-1.343,3-3S29.657,26,28,26z M4,16H3c-1.657,0-3,1.343-3,3s1.343,3,3,3h1c1.657,0,3-1.343,3-3S5.657,16,4,16z"
			/>{" "}
			<path
			  className="cubies_vijftien"
			  d="M19,14c0,2.209-1.791,4-4,4s-4-1.791-4-4s1.791-4,4-4S19,11.791,19,14z M3,26 c-1.657,0-3,1.343-3,3s1.343,3,3,3s3-1.343,3-3S4.657,26,3,26z M27,26c-1.657,0-3,1.343-3,3s1.343,3,3,3s3-1.343,3-3 S28.657,26,27,26z M3,16c-1.657,0-3,1.343-3,3s1.343,3,3,3s3-1.343,3-3S4.657,16,3,16z M27,16c-1.657,0-3,1.343-3,3s1.343,3,3,3 s3-1.343,3-3S28.657,16,27,16z"
			/>{" "}
			<circle className="cubies_veertien" cx={15} cy={13} r={2} />{" "}
			<path
			  className="cubies_een"
			  d="M10,10c0,1.105-0.895,2-2,2s-2-0.895-2-2s0.895-2,2-2S10,8.895,10,10z M22,8c-1.105,0-2,0.895-2,2 s0.895,2,2,2s2-0.895,2-2S23.105,8,22,8z"
			/>{" "}
			<path
			  className="cubies_twaalf"
			  d="M8,9.5C8,9.776,7.776,10,7.5,10S7,9.776,7,9.5S7.224,9,7.5,9S8,9.224,8,9.5z M21.5,9 C21.224,9,21,9.224,21,9.5s0.224,0.5,0.5,0.5S22,9.776,22,9.5S21.776,9,21.5,9z"
			/>{" "}
			<path
			  className="cubies_dertien"
			  d="M4,3c0,0.552-0.448,1-1,1S2,3.552,2,3s0.448-1,1-1S4,2.448,4,3z M27,2c-0.552,0-1,0.448-1,1 s0.448,1,1,1s1-0.448,1-1S27.552,2,27,2z"
			/>{" "}
		  </g>{" "}
		</g>
	  </svg>
	  );
  }
  
  export function GhostLogo(props: SVGProps<SVGSVGElement>) {
	return (<svg
		version="1.1"
		id="Uploaded to svgrepo.com"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		viewBox="0 0 32 32"
		xmlSpace="preserve"
		fill="#000000"
		{...props}
	  >
		<g id="SVGRepo_bgCarrier" strokeWidth={0} />
		<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
		<g id="SVGRepo_iconCarrier">
		  {" "}
		  <style
			type="text/css"
			dangerouslySetInnerHTML={{
			  __html:
				" .cubies_een{fill:#4C4842;} .cubies_vijf{fill:#C9C6C0;} .cubies_zes{fill:#EDEAE5;} .st0{fill:#A4C83F;} .st1{fill:#BCD269;} .st2{fill:#D1DE8B;} .st3{fill:#2EB39A;} .st4{fill:#EC9B5A;} .st5{fill:#65C3AB;} .st6{fill:#EDB57E;} .st7{fill:#F9E0BD;} .st8{fill:#98D3BC;} .st9{fill:#CCE2CD;} .st10{fill:#D97360;} .st11{fill:#E69D8A;} .st12{fill:#F2C99E;} .st13{fill:#67625D;} .st14{fill:#C9483A;} .st15{fill:#FFF2DF;} .st16{fill:#725A48;} .st17{fill:#8E7866;} .st18{fill:#837F79;} .st19{fill:#A5A29C;} .st20{fill:#E3D4C0;} .st21{fill:#E8E8B5;} .st22{fill:#AB9784;} "
			}}
		  />{" "}
		  <g>
			{" "}
			<path
			  className="cubies_vijf"
			  d="M29,0h-2H5H3C1.343,0,0,1.343,0,3v26c0,1.657,1.343,3,3,3c0.353,0,1.647,0,2,0 c0.772,0,1.468-0.3,2-0.779C7.532,31.7,8.228,32,9,32c0.353,0,1.647,0,2,0c0.772,0,1.468-0.3,2-0.779C13.532,31.7,14.228,32,15,32 c0.353,0,1.647,0,2,0c0.772,0,1.468-0.3,2-0.779C19.532,31.7,20.228,32,21,32c0.353,0,1.647,0,2,0c0.772,0,1.468-0.3,2-0.779 C25.532,31.7,26.228,32,27,32c0.353,0,1.647,0,2,0c1.657,0,3-1.343,3-3V3C32,1.343,30.657,0,29,0z"
			/>{" "}
			<path
			  className="cubies_zes"
			  d="M27,0H3C1.343,0,0,1.343,0,3v26c0,1.657,1.343,3,3,3s3-1.343,3-3c0,1.657,1.343,3,3,3s3-1.343,3-3 c0,1.657,1.343,3,3,3s3-1.343,3-3c0,1.657,1.343,3,3,3s3-1.343,3-3c0,1.657,1.343,3,3,3s3-1.343,3-3V3C30,1.343,28.657,0,27,0z"
			/>{" "}
			<path
			  className="cubies_een"
			  d="M18,14c0,1.657-1.343,3-3,3s-3-1.343-3-3s1.343-3,3-3S18,12.343,18,14z M8,8c-1.105,0-2,0.895-2,2 s0.895,2,2,2s2-0.895,2-2S9.105,8,8,8z M22,8c-1.105,0-2,0.895-2,2s0.895,2,2,2s2-0.895,2-2S23.105,8,22,8z"
			/>{" "}
			<path
			  className="cubies_zes"
			  d="M8,9.5C8,9.776,7.776,10,7.5,10S7,9.776,7,9.5S7.224,9,7.5,9S8,9.224,8,9.5z M21.5,9 C21.224,9,21,9.224,21,9.5s0.224,0.5,0.5,0.5S22,9.776,22,9.5S21.776,9,21.5,9z"
			/>{" "}
		  </g>{" "}
		</g>
	  </svg>
	  );
  }

  export function GhostLogoDark(props: SVGProps<SVGSVGElement>) {
	return (<svg
		viewBox="0 0 512 512"
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		stroke="currentColor"
		transform="rotate(270)"
		{...props}
	  >
		<g id="SVGRepo_bgCarrier" strokeWidth={0} />
		<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
		<g id="SVGRepo_iconCarrier">
		  <path
			fill="currentColor"
			d="M135.563 17.5c-16.394-.215-25.532 15.656-25.532 15.656L63 144.562l26 15 72.97-96.406s15.012-26-10.97-41c-5.683-3.28-10.847-4.596-15.438-4.656zm219.656 13.22c-9.124.072-16.47 4.31-16.47 4.31L112.437 183l15 26L368.75 86.97S394.72 71.98 379.72 46c-7.033-12.18-16.452-15.346-24.5-15.28zM16 166v180a90 90 0 0 0 0-180zm435 45l-315 30v30l315 30s45 0 45-45-45-45-45-45zm-323.563 92l-15 26L338.75 476.97s25.97 15.012 40.97-10.97-10.97-40.97-10.97-40.97L127.437 303zM89 352.438l-26 15 47.03 111.406s14.99 25.97 40.97 10.97c25.982-15.002 10.97-40.97 10.97-40.97L89 352.438z"
		  />
		</g>
	  </svg>
	  );
  }


export function StreamlineStickiesColorControl(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={42} height={42} viewBox="0 -1 42 42" {...props}><g fill="none" strokeMiterlimit={10}><path fill="#ffa052" stroke="#231f20" d="M37 17.21c3-.69 3.53-4.27 3.53-7S39.94 4 37 3.29c-1.48-.7-9.41-1.4-16-1.4s-14.48.7-16 1.4C2.06 4 1.5 7.56 1.5 10.25s.56 6.27 3.53 7c1.49.7 9.41 1.4 16 1.4s14.46-.74 15.97-1.44Z" strokeWidth={2}></path><path fill="#e36600" stroke="#231f20" d="M37 36.71c3-.69 3.53-4.27 3.53-7s-.56-6.27-3.53-7c-1.48-.7-9.41-1.4-16-1.4s-14.48.7-16 1.4c-3 .69-3.53 4.27-3.53 7s.59 6.29 3.53 7c1.49.7 9.41 1.4 16 1.4s14.49-.7 16-1.4Z" strokeWidth={2}></path><path fill="#eee" stroke="#231f20" d="M5.68 10.25a4.18 4.18 0 1 0 8.36 0a4.18 4.18 0 0 0-8.36 0Zm22.28 19.5a4.18 4.18 0 1 0 8.358 0a4.18 4.18 0 0 0-8.358 0Z" strokeWidth={2}></path><path stroke="#eee" strokeLinecap="round" d="M34.66 5.29c2.15.54 2.32.71 2.79 2.45m-15.9 15.99c2.35 0 4.22 0 5.33.13" strokeWidth={2}></path></g></svg>);
}



export function StreamlineStickiesColorGraphBarDuo(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} viewBox="0 0 40 40" {...props}><g fill="none" stroke="#000" strokeMiterlimit={10} strokeWidth={0.4}><path fill="#000" d="M5.818 20.812c.902 0 1.968 0 2.82.154c.698.125 2.439 1.013 2.743 1.688c.426.483.634 3.05.634 5.182c0 2.131-.208 4.698-.634 5.18c-.427.949-2.633.949-4.292.949c-1.033 0-2.28 0-3.176-.23c-.59-.152-2.144-1.071-2.387-1.611c-.426-.446-.634-3.05-.634-5.183c0-2.13.208-4.698.634-5.18c.427-.948 2.634-.949 4.292-.949ZM35.296 6.219c-.762-.208-1.63-.212-2.386-.212c-1.658 0-3.865 0-4.29 2.14c-.427 1.062-.635 6.717-.635 11.369c0 4.65.208 10.343.634 11.366c.25 1.246 1.899 2.455 3.092 2.804c.783.227 1.688.23 2.47.23c1.658 0 3.867 0 4.293-2.14c.426-1.061.634-6.716.634-11.367s-.208-10.307-.634-11.33c-.255-1.286-1.941-2.523-3.178-2.86Zm-15.931 7.176c.922 0 2.016.003 2.879.274c.858.268 2.44 1.292 2.683 2.173c.445.815.635 4.89.635 8.299c0 3.41-.209 7.521-.635 8.298c-.427 1.554-2.634 1.554-4.292 1.554c-.81 0-1.754-.003-2.554-.186c-.956-.218-2.735-1.273-3.008-2.261c-.426-.777-.635-4.889-.635-8.298c0-3.41.19-7.484.635-8.299c.426-1.554 2.633-1.554 4.291-1.554Z"></path><path fill="#ff8300" d="M10.109 21.76c-.426-.947-2.633-.947-4.29-.947c-1.66 0-3.867 0-4.293.947c-.426.482-.634 3.05-.634 5.181s.208 4.737.634 5.183c.427.947 2.634.947 4.292.947s3.865 0 4.291-.947c.426-.484.635-3.05.635-5.183c0-2.13-.209-4.698-.635-5.18Zm13.545-6.81c-.426-1.545-2.632-1.555-4.29-1.555s-3.865 0-4.291 1.554c-.446.815-.635 4.888-.635 8.299s.209 7.52.635 8.298c.426 1.544 2.633 1.553 4.291 1.553s3.864 0 4.291-1.554c.426-.777.635-4.888.635-8.297s-.191-7.484-.636-8.299Z"></path><path fill="#fff9f9" d="M37.202 8.185c-.427-2.16-2.634-2.179-4.292-2.179s-3.865 0-4.29 2.141c-.427 1.062-.635 6.717-.635 11.368s.208 10.344.634 11.367c.426 2.123 2.633 2.141 4.29 2.141c1.66 0 3.867 0 4.293-2.14c.426-1.061.634-6.717.634-11.368s-.208-10.307-.634-11.33Z"></path></g></svg>);
}


 
export function ArcticonsCarsmile(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={1024} height={1024} viewBox="0 0 48 48" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M29.65 5.09c.82.82.82 23.2 0 24s-3.2.73-3.78-.34c-.29-.58-.49-5.23-.49-11.67s.2-11.09.49-11.67c.58-1.07 2.86-1.26 3.78-.34Zm-7.95 6.97c.63.63.78 2.14.78 8.72c0 4.6-.2 8.43-.49 9c-.58 1.07-2.85 1.26-3.77.34s-.83-17.39 0-18.21a2.66 2.66 0 0 1 3.48.19Z" strokeWidth={0.4}></path><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M12.26 33.38a12.9 12.9 0 0 0 4.79 3.68a12.1 12.1 0 0 0 6.88 1.6a12.2 12.2 0 0 0 6.3-1.26a15 15 0 0 0 6.1-5c1.41-2.13 4.12-2 4.7.24c.68 2.57-5.47 8.28-10.8 10a24.64 24.64 0 0 1-13 0C10.51 40.25 4.31 32.6 8 31.2c1.65-.58 2.42-.2 4.22 2.18Z" strokeWidth={0.4}></path></svg>);
}


export function SimpleIconsWebmoney(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
		width="256px"
		height="256px"
		viewBox="0 0 64.00 64.00"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		aria-hidden="true"
		role="img"
		className="iconify iconify--emojione"
		preserveAspectRatio="xMidYMid meet"
		fill="#000000"
		{...props}
	  >
		<g id="SVGRepo_bgCarrier" strokeWidth={0} />
		<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
		<g id="SVGRepo_iconCarrier">
		  {" "}
		  <g fill="#ff8800">
			{" "}
			<path d="M59.8 24.3s1.1-6.2-3.5-3.4c0 0-.4-6.3-4.3-1.9c0 0-2.1-3.9-4.4-.3c-3.1 4.8-5.2 12.4-3.2 25l3.8-2.5c2.7-7.9 12.4-8.8 13.7-13.1c.9-3-2.1-3.8-2.1-3.8">
			  {" "}
			</path>{" "}
			<path d="M22.1 17.6l-9.9 3.6C14.4 9.2 28.8 10 28.8 10s-6.8 3.2-6.7 7.6">
			  {" "}
			</path>{" "}
			<path d="M23.7 19.8l-10.5 1.4C18 10 31.9 13.9 31.9 13.9s-7.3 1.6-8.2 5.9">
			  {" "}
			</path>{" "}
		  </g>{" "}
		  <g fill="#3c2f2f">
			{" "}
			<path d="M2 29l5.4-1.4v3.6c0-.1-3.3-.6-5.4-2.2"> </path>{" "}
			<path d="M7.4 27.5L2 24.8c3.6-2.8 7.7-1.9 7.7-1.9l-2.3 4.6z"> </path>{" "}
		  </g>{" "}
		  <g fill="#3c2f2f">
			{" "}
			<path d="M33.8 53h-2.1v7.9c-.3.1-2.1-.1-2.9-.1c-1.8 0-3.3 1.3-3.3 1.3h8.3V53">
			  {" "}
			</path>{" "}
			<path d="M25 53h-2.1v7.9c-.3.1-2.1-.1-2.9-.1c-1.8 0-3.3 1.3-3.3 1.3H25V53">
			  {" "}
			</path>{" "}
		  </g>{" "}
		  <path
			d="M54 36.2c3.9 0-4.1 17.5-23.3 17.5c-13 0-23.9-5.2-23.9-21.5c0-10.1 6.4-18.3 19.5-15c13.3 3.5 6.5 19 27.7 19"
			fill="hsl(28.26,100%,52.55%)"
		  >
			{" "}
		  </path>{" "}
		  <path
			d="M37.6 51.7c-15.6 0-14-12-27.9-11.2c5.1 15.8 27.9 11.2 27.9 11.2"
			fill="#935c10"
		  >
			{" "}
		  </path>{" "}
		  <path
			d="M39.1 29.2c-10-9.8-20.2 6.2-7.9 12.6C43.3 48 51.6 37 51.6 37s-6.1-1.5-12.5-7.8"
			fill="#935c10"
		  >
			{" "}
		  </path>{" "}
		  <circle cx="15.1" cy="24.9" r="2.5" fill="#3c2f2f">
			{" "}
		  </circle>{" "}
		</g>
	  </svg>
	  );
}

export function WalletLogoIcon(props: SVGProps<SVGSVGElement>) {
	return (<svg
		height="200px"
		width="200px"
		version="1.1"
		id="Layer_1"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		viewBox="0 0 511.999 511.999"
		xmlSpace="preserve"
		fill="#000000"
		{...props}
	  >
		<g id="SVGRepo_bgCarrier" strokeWidth={0} />
		<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
		<g id="SVGRepo_iconCarrier">
		  {" "}
		  <polygon
			style={{ fill: "#ffcb8f" }}
			points="380.304,10.199 320.158,10.199 380.304,70.346 "
		  />{" "}
		  <polygon
			style={{ fill: "#d1946b" }}
			points="131.697,162.919 380.304,162.919 380.304,70.346 320.158,10.199 191.843,10.199 131.697,70.346 "
		  />{" "}
		  <polygon
			style={{ fill: "#ffcb8f" }}
			points="131.697,70.346 191.843,10.199 131.697,10.199 "
		  />{" "}
		  <polygon
			style={{ fill: "#947C7C" }}
			points="103.628,403.159 256.001,501.801 408.373,403.159 408.373,163.722 103.628,163.722 "
		  />{" "}
		  <g>
			{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M131.697,0c-5.632,0-10.199,4.566-10.199,10.199v143.322h-17.87 c-5.632,0-10.199,4.566-10.199,10.199v239.439c0,3.459,1.753,6.683,4.656,8.562l152.372,98.641 c1.686,1.091,3.615,1.637,5.543,1.637c1.929,0,3.856-0.546,5.543-1.637l152.372-98.641c2.904-1.88,4.656-5.103,4.656-8.562V163.721 c0-5.633-4.567-10.199-10.199-10.199h-17.87V10.199C390.501,4.566,385.934,0,380.302,0H131.697z M370.105,74.571v78.149H141.896 V74.571l54.173-54.173h119.862L370.105,74.571z M370.105,45.723L344.78,20.398h25.325L370.105,45.723L370.105,45.723z M167.221,20.398l-25.325,25.325V20.398H167.221z M398.173,397.613l-142.173,92.038l-142.173-92.039V173.92h284.347v223.693 H398.173z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M235.15,73.434c5.632,0,10.199-4.566,10.199-10.199v-5.72c0-5.633-4.567-10.199-10.199-10.199 s-10.199,4.566-10.199,10.199v5.72C224.951,68.868,229.517,73.434,235.15,73.434z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M235.15,141.495c5.632,0,10.199-4.566,10.199-10.199V97.612c0-5.633-4.567-10.199-10.199-10.199 s-10.199,4.566-10.199,10.199v33.683C224.951,136.928,229.517,141.495,235.15,141.495z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M276.851,141.495c5.632,0,10.199-4.566,10.199-10.199v-73.78c0-5.633-4.567-10.199-10.199-10.199 c-5.632,0-10.199,4.566-10.199,10.199v73.78C266.652,136.928,271.219,141.495,276.851,141.495z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M129.428,394.999l2.568,1.662c1.713,1.11,3.634,1.64,5.534,1.639c3.343,0,6.618-1.641,8.57-4.656 c2.624-4.052,2.007-9.269-1.199-12.606c-1.057-4.505-5.102-7.859-9.929-7.859c-5.632,0-10.199,4.566-10.199,10.199v3.06 C124.773,389.896,126.526,393.119,129.428,394.999z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M167.657,419.747l4.457,2.885c1.713,1.109,3.634,1.638,5.533,1.638c3.343,0,6.619-1.642,8.571-4.657 c3.061-4.728,1.709-11.044-3.019-14.104l-4.457-2.885c-4.729-3.062-11.044-1.708-14.104,3.019 C161.577,410.371,162.929,416.685,167.657,419.747z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M204.755,431.613c-3.061,4.728-1.709,11.044,3.019,14.104l4.457,2.885 c1.713,1.109,3.634,1.638,5.533,1.638c3.343,0,6.619-1.642,8.571-4.657c3.061-4.728,1.709-11.044-3.019-14.104l-4.457-2.885 C214.129,425.532,207.815,426.885,204.755,431.613z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M256.001,453.252c-4.141-1.076-8.679,0.544-11.13,4.332c-3.061,4.728-1.709,11.044,3.019,14.104 l2.569,1.662c1.686,1.091,3.615,1.637,5.543,1.637c1.929,0,3.856-0.546,5.543-1.637l2.569-1.662 c4.728-3.061,6.08-9.375,3.019-14.104C264.68,453.796,260.144,452.174,256.001,453.252z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M325.782,419.614c1.952,3.016,5.228,4.657,8.571,4.657c1.898,0,3.82-0.529,5.533-1.638l4.457-2.885 c4.728-3.061,6.08-9.376,3.019-14.104c-3.061-4.727-9.374-6.082-14.104-3.019l-4.457,2.885 C324.073,408.57,322.722,414.885,325.782,419.614z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M294.237,450.241c1.898,0,3.82-0.529,5.533-1.638l4.457-2.885c4.728-3.061,6.08-9.376,3.019-14.104 c-3.061-4.728-9.374-6.082-14.104-3.019l-4.457,2.885c-4.728,3.061-6.08,9.376-3.019,14.104 C287.618,448.599,290.894,450.241,294.237,450.241z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M377.028,373.179c-4.827,0-8.872,3.355-9.929,7.859c-3.207,3.336-3.824,8.554-1.199,12.606 c1.952,3.015,5.227,4.656,8.57,4.656c1.899,0,3.821-0.53,5.534-1.639l2.568-1.662c2.904-1.88,4.655-5.103,4.655-8.561v-3.06 C387.228,377.745,382.661,373.179,377.028,373.179z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M377.028,309.464c-5.632,0-10.199,4.566-10.199,10.199v7.079c0,5.633,4.567,10.199,10.199,10.199 c5.632,0,10.199-4.566,10.199-10.199v-7.079C387.228,314.03,382.661,309.464,377.028,309.464z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M377.028,245.75c-5.632,0-10.199,4.566-10.199,10.199v7.079c0,5.633,4.567,10.199,10.199,10.199 c5.632,0,10.199-4.566,10.199-10.199v-7.079C387.228,250.316,382.661,245.75,377.028,245.75z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M368.45,204.833c1.815,2.816,4.979,4.68,8.579,4.68c5.632,0,10.199-4.566,10.199-10.199v-3.06 c0-5.633-4.567-10.199-10.199-10.199h-3.06c-5.632,0-10.199,4.566-10.199,10.199C363.769,199.853,365.634,203.017,368.45,204.833z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M313.3,206.453h6.741c5.632,0,10.199-4.566,10.199-10.199c0-5.633-4.567-10.199-10.199-10.199H313.3 c-5.632,0-10.199,4.566-10.199,10.199C303.1,201.887,307.667,206.453,313.3,206.453z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M191.961,206.453h6.741c5.632,0,10.199-4.566,10.199-10.199c0-5.633-4.567-10.199-10.199-10.199 h-6.741c-5.632,0-10.199,4.566-10.199,10.199C181.762,201.887,186.328,206.453,191.961,206.453z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M252.63,206.453h6.741c5.632,0,10.199-4.566,10.199-10.199c0-5.633-4.567-10.199-10.199-10.199 h-6.741c-5.632,0-10.199,4.566-10.199,10.199C242.43,201.887,246.998,206.453,252.63,206.453z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M134.973,209.513c3.599,0,6.763-1.864,8.579-4.68c2.816-1.815,4.68-4.979,4.68-8.579 c0-5.633-4.567-10.199-10.199-10.199h-3.06c-5.632,0-10.199,4.566-10.199,10.199v3.06 C124.773,204.947,129.34,209.513,134.973,209.513z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M134.973,336.942c5.632,0,10.199-4.566,10.199-10.199v-7.079c0-5.633-4.567-10.199-10.199-10.199 s-10.199,4.566-10.199,10.199v7.079C124.773,332.376,129.34,336.942,134.973,336.942z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M134.973,273.227c5.632,0,10.199-4.566,10.199-10.199v-7.079c0-5.633-4.567-10.199-10.199-10.199 s-10.199,4.566-10.199,10.199v7.079C124.773,268.661,129.34,273.227,134.973,273.227z"
			/>{" "}
		  </g>{" "}
		</g>
	  </svg>
	  );
}

export function WalletLogoIconOpen(props: SVGProps<SVGSVGElement>) {
	return (<svg
		height="200px"
		width="200px"
		version="1.1"
		id="Layer_1"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		viewBox="0 0 512 512"
		xmlSpace="preserve"
		fill="#000000"
		{...props}
	  >
		<g id="SVGRepo_bgCarrier" strokeWidth={0} />
		<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
		<g id="SVGRepo_iconCarrier">
		  {" "}
		  <path
			style={{ fill: "#D35B38" }}
			d="M404.798,72.895C366.605,34.702,313.843,11.08,255.562,11.08S144.52,34.702,106.327,72.895 l149.236,149.236L404.798,72.895z"
		  />{" "}
		  <path
			style={{ fill: "#FFE6B8" }}
			d="M72.015,106.764c-38.193,38.193-61.815,90.955-61.815,149.236s23.622,111.043,61.815,149.236 L221.25,255.999L72.015,106.764z"
		  />{" "}
		  <path
			style={{ fill: "#BCC987" }}
			d="M106.327,439.104c38.193,38.193,90.955,61.815,149.236,61.815s111.043-23.622,149.236-61.815 L255.562,289.868L106.327,439.104z"
		  />{" "}
		  <path
			style={{ fill: "#FFAD61" }}
			d="M439.985,106.764L290.75,255.999l149.236,149.236c38.193-38.193,61.815-90.955,61.815-149.236 S478.178,144.957,439.985,106.764z"
		  />{" "}
		  <g>
			{" "}
			<path
			  style={{ fill: "#4D3D36" }}
			  d="M255.562,232.33c-2.705,0-5.299-1.075-7.212-2.987L99.114,80.107 c-1.912-1.913-2.987-4.507-2.987-7.212c0-2.705,1.075-5.299,2.987-7.212c41.789-41.788,97.35-64.802,156.448-64.802 c59.098,0,114.658,23.013,156.448,64.802c1.912,1.913,2.987,4.507,2.987,7.212c0,2.705-1.075,5.298-2.987,7.212L262.774,229.343 C260.862,231.255,258.267,232.33,255.562,232.33z M120.929,73.074l134.634,134.633L390.195,73.074 C353.218,39.595,305.8,21.279,255.562,21.279C205.325,21.279,157.906,39.595,120.929,73.074z"
			/>{" "}
			<path
			  style={{ fill: "#4D3D36" }}
			  d="M72.015,415.434c-2.705,0-5.299-1.075-7.212-2.987C23.013,370.659,0,315.097,0,255.999 S23.013,141.34,64.803,99.551c1.912-1.912,4.507-2.987,7.212-2.987c2.705,0,5.3,1.075,7.212,2.987l149.236,149.237 c3.983,3.983,3.983,10.441,0,14.425L79.226,412.448C77.314,414.361,74.719,415.434,72.015,415.434z M72.193,121.366 c-33.479,36.977-51.795,84.396-51.795,134.634s18.316,97.656,51.795,134.634l134.634-134.634L72.193,121.366z"
			/>{" "}
			<path
			  style={{ fill: "#4D3D36" }}
			  d="M255.562,511.118c-59.097,0-114.658-23.013-156.448-64.802c-1.912-1.912-2.987-4.507-2.987-7.212 s1.075-5.298,2.987-7.212l149.236-149.237c1.912-1.912,4.507-2.987,7.212-2.987l0,0c2.705,0,5.3,1.075,7.212,2.987L412.01,431.892 c1.912,1.913,2.987,4.507,2.987,7.212s-1.075,5.298-2.987,7.212C370.221,488.104,314.661,511.118,255.562,511.118z M120.929,438.925c36.977,33.479,84.396,51.795,134.634,51.795s97.656-18.316,134.633-51.795L255.562,304.293L120.929,438.925z"
			/>{" "}
			<path
			  style={{ fill: "#4D3D36" }}
			  d="M439.985,415.434c-2.705,0-5.3-1.075-7.212-2.987L283.538,263.211 c-3.983-3.983-3.983-10.441,0-14.425L432.774,99.551c1.912-1.912,4.507-2.987,7.212-2.987s5.3,1.075,7.212,2.987 C488.987,141.34,512,196.902,512,255.999s-23.013,114.659-64.803,156.449C445.285,414.361,442.69,415.434,439.985,415.434z M305.173,255.999l134.634,134.634c33.479-36.977,51.795-84.396,51.795-134.634s-18.316-97.656-51.795-134.634L305.173,255.999z"
			/>{" "}
			<path
			  style={{ fill: "#4D3D36" }}
			  d="M403.888,329.434c-2.61,0-5.221-0.996-7.212-2.987l-2.039-2.039c-3.983-3.983-3.983-10.441,0-14.425 c3.983-3.982,10.441-3.982,14.425,0l2.039,2.039c3.983,3.983,3.983,10.441,0,14.425 C409.109,328.437,406.498,329.434,403.888,329.434z"
			/>{" "}
			<path
			  style={{ fill: "#4D3D36" }}
			  d="M378.39,303.935c-2.61,0-5.22-0.996-7.212-2.987l-36.717-36.716c-3.983-3.983-3.984-10.441,0-14.425 c3.983-3.982,10.441-3.982,14.424,0l36.717,36.716c3.983,3.983,3.984,10.441,0,14.425C383.61,302.938,381,303.935,378.39,303.935z"
			/>{" "}
		  </g>{" "}
		</g>
	  </svg>
	  );
}


export function CategoryCashIcon(props: SVGProps<SVGSVGElement>) {
	return (<svg
		height="200px"
		width="200px"
		version="1.1"
		id="Layer_1"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		viewBox="0 0 512 512"
		xmlSpace="preserve"
		fill="#000000"
		{...props}
	  >
		<g id="SVGRepo_bgCarrier" strokeWidth={0} />
		<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
		<g id="SVGRepo_iconCarrier">
		  {" "}
		  <polygon
			style={{ fill: "#BDD169" }}
			points="434.934,493.758 501.801,426.891 501.801,284.242 434.934,217.601 77.066,217.601 10.199,284.242 10.199,426.891 77.066,493.758 "
		  />{" "}
		  <circle style={{ fill: "#E6E6E6" }} cx={256} cy="355.564" r="75.336" />{" "}
		  <g>
			{" "}
			<polygon
			  style={{ fill: "#FFD890" }}
			  points="501.801,493.758 501.801,426.891 434.934,493.758 "
			/>{" "}
			<polygon
			  style={{ fill: "#FFD890" }}
			  points="434.934,217.601 501.801,284.242 501.801,217.601 "
			/>{" "}
			<polygon
			  style={{ fill: "#FFD890" }}
			  points="10.199,493.758 10.199,426.891 77.066,493.758 "
			/>{" "}
			<polygon
			  style={{ fill: "#FFD890" }}
			  points="77.066,217.601 10.199,284.242 10.199,217.601 "
			/>{" "}
		  </g>{" "}
		  <polygon
			style={{ fill: "#BDD169" }}
			points="501.801,217.601 434.934,151.072 77.066,151.072 10.199,217.601 "
		  />{" "}
		  <g>
			{" "}
			<polygon
			  style={{ fill: "#FFD890" }}
			  points="434.934,151.072 501.801,217.601 501.801,151.072 "
			/>{" "}
			<polygon
			  style={{ fill: "#FFD890" }}
			  points="77.066,151.072 10.199,217.601 10.199,151.072 "
			/>{" "}
		  </g>{" "}
		  <polygon
			style={{ fill: "#BDD169" }}
			points="501.801,151.072 434.934,84.635 77.066,84.635 10.199,151.072 "
		  />{" "}
		  <g>
			{" "}
			<polygon
			  style={{ fill: "#FFD890" }}
			  points="434.934,84.635 501.801,151.072 501.801,84.635 "
			/>{" "}
			<polygon
			  style={{ fill: "#FFD890" }}
			  points="77.066,84.635 10.199,151.072 10.199,84.635 "
			/>{" "}
		  </g>{" "}
		  <polygon
			style={{ fill: "#BDD169" }}
			points="501.801,84.635 434.934,18.242 77.066,18.242 10.199,84.635 "
		  />{" "}
		  <g>
			{" "}
			<polygon
			  style={{ fill: "#FFD890" }}
			  points="434.934,18.242 501.801,84.635 501.801,18.242 "
			/>{" "}
			<polygon
			  style={{ fill: "#FFD890" }}
			  points="77.066,18.242 10.199,84.635 10.199,18.242 "
			/>{" "}
		  </g>{" "}
		  <g>
			{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M256,270.031c-47.165,0-85.536,38.371-85.536,85.536s38.371,85.536,85.536,85.536 s85.536-38.371,85.536-85.536S303.164,270.031,256,270.031z M256,420.703c-35.916,0-65.137-29.22-65.137-65.137 s29.221-65.137,65.137-65.137c35.918,0,65.137,29.22,65.137,65.137S291.918,420.703,256,420.703z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M261.321,344.424V327.04c7.74,0.595,10.002,4.405,13.931,4.405c5.239,0,7.382-6.549,7.382-9.764 c0-8.216-13.931-10.121-21.313-10.359v-2.976c0-1.668-2.262-3.215-4.523-3.215c-2.619,0-4.525,1.548-4.525,3.215v3.334 c-12.622,1.786-23.814,9.05-23.814,24.171c0,15.241,12.86,20.362,23.814,24.529v19.289c-8.812-1.548-12.859-8.572-17.861-8.572 c-4.525,0-8.097,5.953-8.097,10.002c0,7.621,11.669,15.003,25.958,15.479v2.977c0,1.667,1.905,3.214,4.525,3.214 c2.261,0,4.523-1.548,4.523-3.214v-3.453c13.931-2.263,23.457-11.194,23.457-25.957 C284.778,354.069,272.157,348.473,261.321,344.424z M253.462,341.567c-4.524-1.904-7.621-4.048-7.621-7.501 c0-2.858,2.263-5.596,7.621-6.668V341.567z M260.131,379.551v-15.956c4.287,2.024,7.263,4.524,7.263,8.453 C267.394,376.335,264.18,378.597,260.131,379.551z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M10.199,8.043C4.566,8.043,0,12.61,0,18.242v475.516c0,5.632,4.566,10.199,10.199,10.199h491.602 c5.632,0,10.199-4.567,10.199-10.199V18.242c0-5.632-4.567-10.199-10.199-10.199C501.801,8.043,10.199,8.043,10.199,8.043z M81.275,161.271h349.449l46.364,46.13H34.911L81.275,161.271z M477.053,74.434H34.948L81.27,28.44h349.46L477.053,74.434z M20.398,193.065v-31.794h31.956L20.398,193.065z M20.398,94.833h31.933L20.398,126.56V94.833z M34.934,140.873l46.337-46.04 h349.457l46.337,46.04H34.934z M491.602,193.065l-31.955-31.794h31.955V193.065z M491.602,126.56l-31.933-31.727h31.933V126.56z M20.398,259.676v-31.878h31.986L20.398,259.676z M459.617,227.8h31.985v31.878L459.617,227.8z M491.602,60.134l-31.546-31.322 l-0.374-0.371h31.92V60.134z M20.398,60.134V28.441h31.92L20.398,60.134z M20.398,451.514l32.045,32.044H20.398V451.514z M430.709,483.558H81.291l-60.892-60.892V288.477L81.281,227.8h349.438l60.883,60.677v134.189L430.709,483.558z M491.602,483.558 h-32.044l32.044-32.044V483.558z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M457.954,322.187h-4.866c-5.632,0-10.199,4.567-10.199,10.199c0,5.632,4.567,10.199,10.199,10.199 h4.866c5.632,0,10.199-4.567,10.199-10.199C468.154,326.754,463.586,322.187,457.954,322.187z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M375.93,342.586h37.446c5.632,0,10.199-4.567,10.199-10.199c0-5.632-4.567-10.199-10.199-10.199 H375.93c-5.632,0-10.199,4.567-10.199,10.199C365.731,338.018,370.297,342.586,375.93,342.586z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M457.954,368.548H375.93c-5.632,0-10.199,4.567-10.199,10.199c0,5.632,4.567,10.199,10.199,10.199 h82.024c5.632,0,10.199-4.567,10.199-10.199C468.154,373.115,463.586,368.548,457.954,368.548z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M138.332,322.187H56.309c-5.633,0-10.199,4.567-10.199,10.199c0,5.632,4.566,10.199,10.199,10.199 h82.023c5.633,0,10.199-4.567,10.199-10.199C148.531,326.754,143.965,322.187,138.332,322.187z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M138.332,368.548H56.309c-5.633,0-10.199,4.567-10.199,10.199c0,5.632,4.566,10.199,10.199,10.199 h82.023c5.633,0,10.199-4.567,10.199-10.199C148.531,373.115,143.965,368.548,138.332,368.548z"
			/>{" "}
		  </g>{" "}
		</g>
	  </svg>
	  );
}

export function CategoryCryptoIcon(props: SVGProps<SVGSVGElement>) {
	return (<svg
		height="200px"
		width="200px"
		version="1.1"
		id="Layer_1"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		viewBox="0 0 512 512"
		xmlSpace="preserve"
		fill="#000000"
		{...props}
	  >
		<g id="SVGRepo_bgCarrier" strokeWidth={0} />
		<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
		<g id="SVGRepo_iconCarrier">
		  {" "}
		  <path
			style={{ fill: "#FFAD61" }}
			d="M477.279,439.329H59.826c-27.408,0-49.627-22.219-49.627-49.627V112.373h467.08V439.329z"
		  />{" "}
		  <g>
			{" "}
			<path
			  style={{ fill: "#FFE6B8" }}
			  d="M477.279,150.907H49.317c-21.604,0-39.118-17.514-39.118-39.118l0,0 c0-21.604,17.514-39.118,39.118-39.118h400.521c15.155,0,27.441,12.286,27.441,27.441V150.907z"
			/>{" "}
			<path
			  style={{ fill: "#FFE6B8" }}
			  d="M409.115,349.562h92.686V238.338h-92.686c-30.714,0-55.611,24.898-55.611,55.611l0,0 C353.503,324.664,378.401,349.562,409.115,349.562z"
			/>{" "}
		  </g>{" "}
		  <circle style={{ fill: "#D35B38" }} cx="411.67" cy="293.951" r="19.595" />{" "}
		  <g>
			{" "}
			<path
			  style={{ fill: "#4D3D36" }}
			  d="M60.41,121.404h296.596c5.632,0,10.199-4.567,10.199-10.199s-4.567-10.199-10.199-10.199H60.41 c-5.633,0-10.199,4.567-10.199,10.199S54.778,121.404,60.41,121.404z"
			/>{" "}
			<path
			  style={{ fill: "#4D3D36" }}
			  d="M406.948,121.404h12.845c5.632,0,10.199-4.567,10.199-10.199s-4.567-10.199-10.199-10.199h-12.845 c-5.632,0-10.199,4.567-10.199,10.199S401.316,121.404,406.948,121.404z"
			/>{" "}
			<path
			  style={{ fill: "#4D3D36" }}
			  d="M487.478,100.112c0-20.755-16.886-37.64-37.639-37.64H49.317C22.123,62.472,0,84.595,0,111.788 c0,0.131,0.009,0.258,0.01,0.389c-0.002,0.066-0.01,0.13-0.01,0.196v277.329c0,32.988,26.838,59.826,59.826,59.826h417.452 c5.632,0,10.199-4.567,10.199-10.199v-79.568h14.323c5.632,0,10.199-4.567,10.199-10.199V238.339 c0-5.632-4.567-10.199-10.199-10.199h-14.323V100.112z M467.08,140.708H49.317c-15.945,0-28.919-12.973-28.919-28.92 c0-15.945,12.973-28.919,28.919-28.919h400.522c9.507,0,17.241,7.735,17.241,17.242V140.708z M467.08,429.129H59.826 c-21.741,0-39.428-17.687-39.428-39.428V151.702c8.131,5.907,18.122,9.405,28.919,9.405H467.08v67.033h-57.965 c-36.288,0-65.81,29.523-65.81,65.81s29.523,65.81,65.81,65.81h57.965V429.129z M491.602,339.362h-82.487 c-25.041,0-45.412-20.372-45.412-45.412c0-25.04,20.372-45.412,45.412-45.412h82.487V339.362z"
			/>{" "}
			<path
			  style={{ fill: "#4D3D36" }}
			  d="M381.879,293.95c0,16.428,13.365,29.794,29.793,29.794s29.794-13.365,29.794-29.794 c0-16.429-13.365-29.794-29.794-29.794C395.243,264.156,381.879,277.522,381.879,293.95z M411.671,284.555 c5.18,0,9.396,4.215,9.396,9.396c0,5.18-4.215,9.396-9.396,9.396s-9.394-4.215-9.394-9.396 C402.277,288.77,406.491,284.555,411.671,284.555z"
			/>{" "}
		  </g>{" "}
		</g>
	  </svg>
	  );
}
export function CategoryCreditCardIcon(props: SVGProps<SVGSVGElement>) {
	return (<svg
		version="1.1"
		id="Layer_1"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		viewBox="0 0 512 512"
		xmlSpace="preserve"
		fill="#000000"
		{...props}
	  >
		<g id="SVGRepo_bgCarrier" strokeWidth={0} />
		<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
		<g id="SVGRepo_iconCarrier">
		  {" "}
		  <rect
			x="122.819"
			y="64.51"
			style={{ fill: "#E6E6E6" }}
			width="378.982"
			height="224.495"
		  />{" "}
		  <rect
			x="10.199"
			y="222.995"
			style={{ fill: "#FFD890" }}
			width="378.982"
			height="224.495"
		  />{" "}
		  <rect
			x="122.819"
			y="113.996"
			style={{ fill: "#947C7C" }}
			width="378.982"
			height="48.283"
		  />{" "}
		  <circle style={{ fill: "#FF9839" }} cx="313.972" cy="375.453" r="27.619" />{" "}
		  <g>
			{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M512,64.509c0-5.632-4.566-10.199-10.199-10.199H122.817c-5.633,0-10.199,4.567-10.199,10.199 v148.29H10.199C4.566,212.799,0,217.366,0,222.998v224.493c0,5.632,4.566,10.199,10.199,10.199h378.984 c5.633,0,10.199-4.567,10.199-10.199v-148.29h102.418c5.633,0,10.199-4.567,10.199-10.199V64.509z M491.602,74.708v29.087H133.016 V74.708H491.602z M491.602,152.073H133.016v-27.88h358.586V152.073z M378.984,437.292H20.398V233.198h358.586V437.292z M399.382,278.802v-55.805c0-5.632-4.566-10.199-10.199-10.199H133.016v-40.328h358.586v106.332H399.382z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M65.43,287.195h36.795c5.633,0,10.199-4.567,10.199-10.199c0-5.632-4.566-10.199-10.199-10.199 H65.43c-5.633,0-10.199,4.567-10.199,10.199C55.231,282.628,59.797,287.195,65.43,287.195z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M142.699,287.195h36.795c5.633,0,10.199-4.567,10.199-10.199c0-5.632-4.566-10.199-10.199-10.199 h-36.795c-5.633,0-10.199,4.567-10.199,10.199C132.5,282.628,137.066,287.195,142.699,287.195z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M219.542,287.195h36.795c5.633,0,10.199-4.567,10.199-10.199c0-5.632-4.566-10.199-10.199-10.199 h-36.795c-5.633,0-10.199,4.567-10.199,10.199C209.343,282.628,213.909,287.195,219.542,287.195z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M295.959,287.195h36.795c5.633,0,10.199-4.567,10.199-10.199c0-5.632-4.566-10.199-10.199-10.199 h-36.795c-5.633,0-10.199,4.567-10.199,10.199C285.76,282.628,290.326,287.195,295.959,287.195z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M238.935,375.451c0,20.851,16.963,37.815,37.815,37.815c6.535,0,12.97-1.722,18.619-4.911 c5.497,3.12,11.842,4.911,18.601,4.911c20.851,0,37.815-16.963,37.815-37.815s-16.963-37.815-37.815-37.815 c-6.759,0-13.104,1.791-18.6,4.911c-5.649-3.189-12.085-4.911-18.62-4.911C255.898,337.636,238.935,354.6,238.935,375.451z M331.386,375.451c0,9.604-7.813,17.416-17.416,17.416c-9.604,0-17.416-7.813-17.416-17.416s7.813-17.416,17.416-17.416 C323.574,358.035,331.386,365.847,331.386,375.451z M276.749,358.035c1.188,0,2.352,0.131,3.488,0.359 c-2.604,5.129-4.082,10.921-4.082,17.057c0,6.135,1.478,11.928,4.082,17.057c-1.135,0.229-2.299,0.36-3.488,0.36 c-9.604,0-17.416-7.813-17.416-17.416C259.333,365.848,267.146,358.035,276.749,358.035z"
			/>{" "}
		  </g>{" "}
		</g>
	  </svg>
	  );
}

export function CategoryValuablesIcon(props: SVGProps<SVGSVGElement>) {
	return (<svg
		height="200px"
		width="200px"
		version="1.1"
		id="Layer_1"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		viewBox="0 0 512.001 512.001"
		xmlSpace="preserve"
		fill="#000000"
		{...props}
	  >
		<g id="SVGRepo_bgCarrier" strokeWidth={0} />
		<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
		<g id="SVGRepo_iconCarrier">
		  {" "}
		  <polygon
			style={{ fill: "#84c6dc" }}
			points="256.994,443.475 9.752,194.197 104.191,68.729 409.799,68.729 504.237,194.197 "
		  />{" "}
		  <g>
			{" "}
			<polygon
			  style={{ fill: "#a9e1f9" }}
			  points="504.236,194.202 256.994,443.475 385.45,194.202 "
			/>{" "}
			<polygon
			  style={{ fill: "#a9e1f9" }}
			  points="256.994,194.202 256.994,443.475 128.539,194.202 "
			/>{" "}
			<polygon
			  style={{ fill: "#a9e1f9" }}
			  points="104.191,68.724 128.539,194.202 9.752,194.202 "
			/>{" "}
		  </g>{" "}
		  <polygon
			style={{ fill: "#a4dcea" }}
			points="385.45,194.202 256.994,194.202 256.994,68.724 "
		  />{" "}
		  <g>
			{" "}
			<polygon
			  style={{ fill: "#a9e1f9" }}
			  points="409.798,68.724 504.236,194.202 385.45,194.202 "
			/>{" "}
			<polygon
			  style={{ fill: "#a9e1f9" }}
			  points="385.45,194.202 256.994,443.475 256.994,194.202 "
			/>{" "}
			<polygon
			  style={{ fill: "#a9e1f9" }}
			  points="256.994,68.724 128.539,194.202 104.191,68.724 "
			/>{" "}
		  </g>{" "}
		  <path d="M510.241,188.829L415.802,63.361c-1.655-2.198-4.246-3.492-6.997-3.492H103.197c-2.751,0-5.343,1.293-6.997,3.492 L1.761,188.829c-2.617,3.476-2.285,8.345,0.779,11.435l54.211,54.657c3.406,3.433,8.952,3.455,12.387,0.05 c3.434-3.406,3.457-8.952,0.05-12.387l-39.407-39.73h92.426l99.948,193.957L93.617,267.216c-3.408-3.436-8.953-3.457-12.387-0.051 c-3.434,3.406-3.457,8.952-0.05,12.387l168.602,169.991c1.644,1.657,3.883,2.59,6.218,2.59c2.336,0,4.574-0.933,6.218-2.59 l247.242-249.278C512.525,197.174,512.856,192.304,510.241,188.829z M352.382,256.338c-4.299-2.216-9.582-0.527-11.798,3.773 l-75.825,147.146V202.854h105.33l-10.369,20.122c-2.215,4.3-0.526,9.582,3.773,11.798c4.301,2.215,9.582,0.527,11.798-3.773 l14.503-28.147h92.425l-192.37,193.957l66.306-128.675C358.371,263.836,356.681,258.554,352.382,256.338z M116.925,185.337H26.313 L98.35,89.629L116.925,185.337z M113.819,77.386H234.5L133.05,176.477L113.819,77.386z M247.243,89.425v95.912h-98.195 L247.243,89.425z M264.76,89.425l98.195,95.912H264.76L264.76,89.425L264.76,89.425z M277.501,77.386h120.683l-19.231,99.093 L277.501,77.386z M395.077,185.337L413.65,89.63l72.038,95.707H395.077z M247.243,202.854v204.404l-105.33-204.404H247.243z" />{" "}
		</g>
	  </svg>
	  );
}

export function CategoryMortgageIcon(props: SVGProps<SVGSVGElement>) {
	return (<svg
		version="1.1"
		id="Layer_1"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		viewBox="0 0 512 512"
		xmlSpace="preserve"
		fill="#000000"
		{...props}
	  >
		<g id="SVGRepo_bgCarrier" strokeWidth={0} />
		<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
		<g id="SVGRepo_iconCarrier">
		  {" "}
		  <rect
			x="84.112"
			y="158.016"
			style={{ fill: "#E6E6E6" }}
			width="343.785"
			height="343.785"
		  />{" "}
		  <polygon
			style={{ fill: "#ff8e6b" }}
			points="55.459,158.108 255.999,10.2 456.539,158.108 "
		  />{" "}
		  <path
			style={{ fill: "#FFD890" }}
			d="M255.999,457.009L255.999,457.009c-70.195,0-127.099-56.904-127.099-127.099l0,0 c0-70.195,56.904-127.099,127.099-127.099l0,0c70.195,0,127.099,56.904,127.099,127.099l0,0 C383.1,400.105,326.195,457.009,255.999,457.009z"
		  />{" "}
		  <g>
			{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M462.593,149.9L262.054,1.992c-3.598-2.656-8.509-2.656-12.107,0L49.406,149.9 c-3.545,2.614-5.011,7.21-3.635,11.395c1.377,4.186,5.284,7.013,9.689,7.013h18.448v333.494c0,5.632,4.566,10.199,10.199,10.199 h343.785c5.633,0,10.199-4.567,10.199-10.199V168.307h18.448c4.405,0,8.312-2.827,9.689-7.013 C467.604,157.111,466.139,152.515,462.593,149.9z M255.999,22.873l169.405,124.944H86.596L255.999,22.873z M417.692,491.602H94.306 V168.307h323.386V491.602z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M255.999,467.208c75.707,0,137.299-61.592,137.299-137.299s-61.592-137.3-137.299-137.3 s-137.299,61.592-137.299,137.299S180.293,467.208,255.999,467.208z M255.999,213.008c64.459,0,116.9,52.441,116.9,116.9 s-52.441,116.901-116.9,116.901s-116.9-52.441-116.9-116.9S191.54,213.008,255.999,213.008z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M222.249,364.55c-4.676,0-8.605,6.173-8.605,10.661c0,9.165,15.712,21.698,38.906,22.072v5.799 c0,2.245,2.245,4.302,5.424,4.302c2.806,0,5.612-2.057,5.612-4.302v-6.359c20.202-2.806,34.043-15.525,34.043-38.532 c0-25.439-17.769-33.67-34.043-39.655v-37.971c13.094,0.935,17.957,6.921,22.445,6.921c5.612,0,8.23-7.109,8.23-10.662 c0-9.165-17.957-13.094-30.676-13.467v-5.051c0-2.244-2.806-4.302-5.612-4.302c-3.18,0-5.424,2.058-5.424,4.302v5.424 c-17.77,1.871-35.539,11.223-35.539,34.792c0,23.943,18.704,30.675,35.539,36.661v43.957 C233.472,377.644,228.422,364.55,222.249,364.55z M262.465,339.298c9.165,3.929,16.461,9.165,16.461,20.95 c0,10.661-6.36,16.647-16.461,18.518V339.298z M235.717,296.652c0-9.727,7.482-14.403,17.957-15.712v34.043 C243.76,311.242,235.717,307.313,235.717,296.652z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M281.755,137.981h80.627c5.633,0,10.199-4.567,10.199-10.199s-4.566-10.199-10.199-10.199h-80.627 c-5.633,0-10.199,4.567-10.199,10.199S276.122,137.981,281.755,137.981z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M243.682,137.981h4.479c5.633,0,10.199-4.567,10.199-10.199s-4.566-10.199-10.199-10.199h-4.479 c-5.633,0-10.199,4.567-10.199,10.199S238.049,137.981,243.682,137.981z"
			/>{" "}
		  </g>{" "}
		</g>
	  </svg>
	  
	  );
}

export function CategoryVehicleIcon(props: SVGProps<SVGSVGElement>) {
	return (<svg
	
		id="Layer_1"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		viewBox="0 0 64 64"
		enableBackground="new 0 0 64 64"
		xmlSpace="preserve"
		fill="#000000"
		{...props}
	  >
		<g id="SVGRepo_bgCarrier" strokeWidth={0} />
		<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
		<g id="SVGRepo_iconCarrier">
		  {" "}
		  <g>
			{" "}
			<g>
			  {" "}
			  <path
				fill="#e9a15d"
				d="M27,8h10c17.495,0,18,21.544,18,24h2c0-2.661-0.533-26-19-26H26C18.904,6,7,9.378,7,32h2 C9,16.523,15.393,8,27,8z"
			  />{" "}
			  <path
				fill="#e9a15d"
				d="M58,34H6c-2.206,0-4,1.794-4,4v10c0,2.206,1.794,4,4,4h52c2.206,0,4-1.794,4-4V38 C62,35.794,60.206,34,58,34z"
			  />{" "}
			</g>{" "}
			<g>
			  {" "}
			  <path
				fill="#f4cda9"
				d="M50.581,19.394C47.909,13.16,43.34,10,37,10H27c-7.299,0-16,3.816-16,22h5c0-4.418,3.582-8,8-8 s8,3.582,8,8h21C53,30.367,52.825,24.632,50.581,19.394z"
			  />{" "}
			  <path
				fill="#f4cda9"
				d="M24,26c-3.313,0-6,2.687-6,6h12C30,28.687,27.313,26,24,26z"
			  />{" "}
			</g>{" "}
			<g>
			  {" "}
			  <path
				fill="#4a3f36"
				d="M58.982,32.088C58.985,32.057,59,32.031,59,32c0-2.866-0.589-28-21-28H26C12.654,4,5,14.206,5,32 c0,0.031,0.015,0.057,0.018,0.088C2.176,32.559,0,35.027,0,38v10c0,3.309,2.691,6,6,6v5c0,0.553,0.447,1,1,1h8 c0.553,0,1-0.447,1-1v-5h32v5c0,0.553,0.447,1,1,1h8c0.553,0,1-0.447,1-1v-5c3.309,0,6-2.691,6-6V38 C64,35.027,61.824,32.559,58.982,32.088z M26,6h12c18.467,0,19,23.339,19,26h-2c0-2.456-0.505-24-18-24H27C15.393,8,9,16.523,9,32 H7C7,9.378,18.904,6,26,6z M24,24c-4.418,0-8,3.582-8,8h-5c0-18.184,8.701-22,16-22h10c6.34,0,10.909,3.16,13.581,9.394 C52.825,24.632,53,30.367,53,32H32C32,27.582,28.418,24,24,24z M30,32H18c0-3.313,2.687-6,6-6S30,28.687,30,32z M14,58H8v-4h6V58z M56,58h-6v-4h6V58z M62,48c0,2.206-1.794,4-4,4H6c-2.206,0-4-1.794-4-4V38c0-2.206,1.794-4,4-4h52c2.206,0,4,1.794,4,4V48z"
			  />{" "}
			  <path
				fill="#4a3f36"
				d="M11,39c-2.206,0-4,1.794-4,4s1.794,4,4,4s4-1.794,4-4S13.206,39,11,39z M11,45c-1.103,0-2-0.897-2-2 s0.897-2,2-2s2,0.897,2,2S12.103,45,11,45z"
			  />{" "}
			  <path
				fill="#4a3f36"
				d="M53,39c-2.206,0-4,1.794-4,4s1.794,4,4,4s4-1.794,4-4S55.206,39,53,39z M53,45c-1.103,0-2-0.897-2-2 s0.897-2,2-2s2,0.897,2,2S54.103,45,53,45z"
			  />{" "}
			  <path
				fill="#4a3f36"
				d="M43,40H21c-0.553,0-1,0.447-1,1s0.447,1,1,1h22c0.553,0,1-0.447,1-1S43.553,40,43,40z"
			  />{" "}
			  <path
				fill="#4a3f36"
				d="M43,44H21c-0.553,0-1,0.447-1,1s0.447,1,1,1h22c0.553,0,1-0.447,1-1S43.553,44,43,44z"
			  />{" "}
			  <path
				fill="#4a3f36"
				d="M43.293,18.708c0.195,0.195,0.451,0.293,0.707,0.293s0.512-0.098,0.707-0.293 c0.391-0.391,0.391-1.023,0-1.414l-2-2c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414L43.293,18.708z"
			  />{" "}
			  <path
				fill="#4a3f36"
				d="M43.293,23.707C43.488,23.902,43.744,24,44,24s0.512-0.098,0.707-0.293c0.391-0.391,0.391-1.023,0-1.414 l-7-7c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414L43.293,23.707z"
			  />{" "}
			</g>{" "}
			<g>
			  {" "}
			  <rect x={8} y={54} fill="#4a3f36" width={6} height={4} />{" "}
			  <rect x={50} y={54} fill="#4a3f36" width={6} height={4} />{" "}
			</g>{" "}
			<g>
			  {" "}
			  <circle fill="#f4cda9" cx={11} cy={43} r={2} />{" "}
			  <circle fill="#f4cda9" cx={53} cy={43} r={2} />{" "}
			</g>{" "}
			<path
			  opacity="0.15"
			  fill="#231F20"
			  d="M30,32H18c0-3.313,2.687-6,6-6S30,28.687,30,32z"
			/>{" "}
		  </g>{" "}
		</g>
	  </svg>
	  );
}

export function CategoryInvestmentsIcon(props: SVGProps<SVGSVGElement>) {
	return (<svg
		height="200px"
		width="200px"
		version="1.1"
		id="Layer_1"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		viewBox="0 0 511.999 511.999"
		xmlSpace="preserve"
		fill="#000000"
		{...props}
	  >
		<g id="SVGRepo_bgCarrier" strokeWidth={0} />
		<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
		<g id="SVGRepo_iconCarrier">
		  {" "}
		  <polygon
			style={{ fill: "#e99116" }}
			points="501.8,478.313 501.8,33.686 10.199,478.313 "
		  />{" "}
		  <g>
			{" "}
			<path
			  style={{ fill: "#693a3a" }}
			  d="M505.938,24.365c-3.687-1.636-7.989-0.949-10.979,1.758L3.358,470.748 c-3.128,2.829-4.192,7.293-2.676,11.23c1.517,3.937,5.299,6.534,9.518,6.534H501.8c5.633,0,10.199-4.567,10.199-10.199V33.686 C511.999,29.655,509.623,26,505.938,24.365z M491.601,468.113H36.681l454.92-411.45V468.113z"
			/>{" "}
			<path
			  style={{ fill: "#693a3a" }}
			  d="M34.352,375.376c2.561,0,5.125-0.959,7.108-2.885L364.995,58.037v41.675 c0,5.632,4.566,10.199,10.199,10.199s10.199-4.567,10.199-10.199V34.166c0-5.632-4.566-10.199-10.199-10.199h-65.547 c-5.633,0-10.199,4.567-10.199,10.199s4.566,10.199,10.199,10.199h40.148L27.242,357.863c-4.039,3.927-4.132,10.383-0.205,14.423 C29.037,374.343,31.693,375.376,34.352,375.376z"
			/>{" "}
			<path
			  style={{ fill: "#693a3a" }}
			  d="M466.987,450.85c5.633,0,10.199-4.567,10.199-10.199v-77.514c0-5.632-4.566-10.199-10.199-10.199 c-5.633,0-10.199,4.567-10.199,10.199v77.514C456.788,446.283,461.354,450.85,466.987,450.85z"
			/>{" "}
			<path
			  style={{ fill: "#693a3a" }}
			  d="M466.987,337.639c5.633,0,10.199-4.567,10.199-10.199v-6.12c0-5.632-4.566-10.199-10.199-10.199 c-5.633,0-10.199,4.567-10.199,10.199v6.12C456.788,333.072,461.354,337.639,466.987,337.639z"
			/>{" "}
		  </g>{" "}
		</g>
	  </svg>
	  );
}

export function CategoryRealEstateIcon(props: SVGProps<SVGSVGElement>) {
	return (<svg
	
		id="Layer_1"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		viewBox="0 0 64 64"
		enableBackground="new 0 0 64 64"
		xmlSpace="preserve"
		fill="#000000"
		{...props}
	  >
		<g id="SVGRepo_bgCarrier" strokeWidth={0} />
		<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
		<g id="SVGRepo_iconCarrier">
		  {" "}
		  <g>
			{" "}
			<g>
			  {" "}
			  <path
				fill="#ffc085"
				d="M2,15v46c0,1.104,0.896,2,2,2h12V13H4C2.896,13,2,13.896,2,15z"
			  />{" "}
			  <path
				fill="#ffc085"
				d="M44,3H20c-1.104,0-2,0.896-2,2v58l0.001,0.002H27V54c0-0.553,0.447-1,1-1h8c0.553,0,1,0.447,1,1v9.002 h8.999L46,63V5C46,3.896,45.104,3,44,3z"
			  />{" "}
			  <path
				fill="#ffc085"
				d="M60,23H48v40h12c1.104,0,2-0.896,2-2V25C62,23.896,61.104,23,60,23z"
			  />{" "}
			</g>{" "}
			<path
			  fill="#593f27"
			  d="M60,21H48V5c0-2.211-1.789-4-4-4H20c-2.211,0-4,1.789-4,4v6H4c-2.211,0-4,1.789-4,4v46c0,2.211,1.789,4,4,4 h56c2.211,0,4-1.789,4-4V25C64,22.789,62.211,21,60,21z M16,63H4c-1.104,0-2-0.896-2-2V15c0-1.104,0.896-2,2-2h12V63z M35,63.002 h-6V55h6V63.002z M46,63l-0.001,0.002H37V54c0-0.553-0.447-1-1-1h-8c-0.553,0-1,0.447-1,1v9.002h-8.999L18,63V5 c0-1.104,0.896-2,2-2h24c1.104,0,2,0.896,2,2V63z M62,61c0,1.104-0.896,2-2,2H48V23h12c1.104,0,2,0.896,2,2V61z"
			/>{" "}
			<path
			  fill="#593f27"
			  d="M7,25h4c0.553,0,1-0.447,1-1v-4c0-0.553-0.447-1-1-1H7c-0.553,0-1,0.447-1,1v4C6,24.553,6.447,25,7,25z M8,21h2v2H8V21z"
			/>{" "}
			<path
			  fill="#593f27"
			  d="M7,35h4c0.553,0,1-0.447,1-1v-4c0-0.553-0.447-1-1-1H7c-0.553,0-1,0.447-1,1v4C6,34.553,6.447,35,7,35z M8,31h2v2H8V31z"
			/>{" "}
			<path
			  fill="#593f27"
			  d="M7,45h4c0.553,0,1-0.447,1-1v-4c0-0.553-0.447-1-1-1H7c-0.553,0-1,0.447-1,1v4C6,44.553,6.447,45,7,45z M8,41h2v2H8V41z"
			/>{" "}
			<path
			  fill="#593f27"
			  d="M29,19h-4c-0.553,0-1,0.447-1,1v4c0,0.553,0.447,1,1,1h4c0.553,0,1-0.447,1-1v-4C30,19.447,29.553,19,29,19 z M28,23h-2v-2h2V23z"
			/>{" "}
			<path
			  fill="#593f27"
			  d="M29,29h-4c-0.553,0-1,0.447-1,1v4c0,0.553,0.447,1,1,1h4c0.553,0,1-0.447,1-1v-4C30,29.447,29.553,29,29,29 z M28,33h-2v-2h2V33z"
			/>{" "}
			<path
			  fill="#593f27"
			  d="M29,39h-4c-0.553,0-1,0.447-1,1v4c0,0.553,0.447,1,1,1h4c0.553,0,1-0.447,1-1v-4C30,39.447,29.553,39,29,39 z M28,43h-2v-2h2V43z"
			/>{" "}
			<path
			  fill="#593f27"
			  d="M39,19h-4c-0.553,0-1,0.447-1,1v4c0,0.553,0.447,1,1,1h4c0.553,0,1-0.447,1-1v-4C40,19.447,39.553,19,39,19 z M38,23h-2v-2h2V23z"
			/>{" "}
			<path
			  fill="#593f27"
			  d="M29,9h-4c-0.553,0-1,0.447-1,1v4c0,0.553,0.447,1,1,1h4c0.553,0,1-0.447,1-1v-4C30,9.447,29.553,9,29,9z M28,13h-2v-2h2V13z"
			/>{" "}
			<path
			  fill="#593f27"
			  d="M39,9h-4c-0.553,0-1,0.447-1,1v4c0,0.553,0.447,1,1,1h4c0.553,0,1-0.447,1-1v-4C40,9.447,39.553,9,39,9z M38,13h-2v-2h2V13z"
			/>{" "}
			<path
			  fill="#593f27"
			  d="M39,29h-4c-0.553,0-1,0.447-1,1v4c0,0.553,0.447,1,1,1h4c0.553,0,1-0.447,1-1v-4C40,29.447,39.553,29,39,29 z M38,33h-2v-2h2V33z"
			/>{" "}
			<path
			  fill="#593f27"
			  d="M39,39h-4c-0.553,0-1,0.447-1,1v4c0,0.553,0.447,1,1,1h4c0.553,0,1-0.447,1-1v-4C40,39.447,39.553,39,39,39 z M38,43h-2v-2h2V43z"
			/>{" "}
			<path
			  fill="#593f27"
			  d="M57,29h-4c-0.553,0-1,0.447-1,1v4c0,0.553,0.447,1,1,1h4c0.553,0,1-0.447,1-1v-4C58,29.447,57.553,29,57,29 z M56,33h-2v-2h2V33z"
			/>{" "}
			<path
			  fill="#593f27"
			  d="M57,39h-4c-0.553,0-1,0.447-1,1v4c0,0.553,0.447,1,1,1h4c0.553,0,1-0.447,1-1v-4C58,39.447,57.553,39,57,39 z M56,43h-2v-2h2V43z"
			/>{" "}
			<path
			  fill="#593f27"
			  d="M57,49h-4c-0.553,0-1,0.447-1,1v4c0,0.553,0.447,1,1,1h4c0.553,0,1-0.447,1-1v-4C58,49.447,57.553,49,57,49 z M56,53h-2v-2h2V53z"
			/>{" "}
			<path
			  fill="#593f27"
			  d="M7,55h4c0.553,0,1-0.447,1-1v-4c0-0.553-0.447-1-1-1H7c-0.553,0-1,0.447-1,1v4C6,54.553,6.447,55,7,55z M8,51h2v2H8V51z"
			/>{" "}
			<g opacity="0.15">
			  {" "}
			  <path d="M2,15v46c0,1.104,0.896,2,2,2h12V13H4C2.896,13,2,13.896,2,15z" />{" "}
			  <path d="M60,23H48v40h12c1.104,0,2-0.896,2-2V25C62,23.896,61.104,23,60,23z" />{" "}
			</g>{" "}
			<rect x={29} y={55} fill="#F76D57" width={6} height="8.002" />{" "}
			<g>
			  {" "}
			  <rect x={8} y={21} fill="#8b782d" width="2.001" height="2.002" />{" "}
			  <rect x={8} y={31} fill="#8b782d" width="2.001" height="2.002" />{" "}
			  <rect x={8} y={41} fill="#8b782d" width="2.001" height="2.002" />{" "}
			  <rect x={8} y={51} fill="#8b782d" width="2.001" height="2.002" />{" "}
			  <rect x={26} y={11} fill="#8b782d" width="2.001" height="2.002" />{" "}
			  <rect x={26} y={21} fill="#8b782d" width="2.001" height="2.002" />{" "}
			  <rect x={26} y={31} fill="#8b782d" width="2.001" height="2.002" />{" "}
			  <rect x={26} y={41} fill="#8b782d" width="2.001" height="2.002" />{" "}
			  <rect x={36} y={11} fill="#8b782d" width="2.001" height="2.002" />{" "}
			  <rect x={36} y={21} fill="#8b782d" width="2.001" height="2.002" />{" "}
			  <rect x={36} y={31} fill="#8b782d" width="2.001" height="2.002" />{" "}
			  <rect x={36} y={41} fill="#8b782d" width="2.001" height="2.002" />{" "}
			  <rect x={54} y={31} fill="#8b782d" width="2.001" height="2.002" />{" "}
			  <rect x={54} y={41} fill="#8b782d" width="2.001" height="2.002" />{" "}
			  <rect x={54} y={51} fill="#8b782d" width="2.001" height="2.002" />{" "}
			</g>{" "}
		  </g>{" "}
		</g>
	  </svg>
	  
	  );
}

export function CategoryLoanIcon(props: SVGProps<SVGSVGElement>) {
	return (<svg
		version="1.1"
		id="Layer_1"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		viewBox="0 0 480.008 480.008"
		xmlSpace="preserve"
		fill="#000000"
		{...props}
	  >
		<g id="SVGRepo_bgCarrier" strokeWidth={0} />
		<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
		<g id="SVGRepo_iconCarrier">
		  {" "}
		  <ellipse
			style={{ fill: "#F5BA46" }}
			cx="241.442"
			cy="186.852"
			rx="99.202"
			ry="99.202"
		  />{" "}
		  <path d="M184,32.004c4.416,0,8-3.576,8-8v-16c0-4.424-3.584-8-8-8s-8,3.576-8,8v16C176,28.428,179.584,32.004,184,32.004z" />{" "}
		  <path d="M320,112.004v-48c0-4.424-3.576-8-8-8s-8,3.576-8,8V99.98c-17.64-12.736-39.216-19.976-62.56-19.976 c-0.232,0-0.472,0-0.696,0c-17.592,0-34.128,4.2-48.744,11.832V56.004c0-4.424-3.584-8-8-8s-8,3.576-8,8v46.128 c-25.536,19.768-41.992,51.672-41.768,86.384c0.376,58.872,48.392,107.488,107.184,107.488c0.232,0,0.472,0,0.696,0 c59.112,0,106.896-49.76,106.512-108.872c-0.176-28-11.216-53.872-28.984-72.872C319.776,113.676,320,112.628,320,112.004z M242.008,280.004c-0.2,0-0.392,0-0.592,0c-50.016,0-90.864-41.328-91.184-91.416c-0.328-50.28,40.328-92.584,90.608-92.584 c0.2,0,0.392,0,0.592,0c50.016,0,90.864,41.328,91.184,91.416C332.944,237.7,292.296,280.004,242.008,280.004z" />{" "}
		  <path d="M312,40.004c4.424,0,8-3.576,8-8v-16c0-4.424-3.576-8-8-8s-8,3.576-8,8v16C304,36.428,307.576,40.004,312,40.004z" />{" "}
		  <path d="M96,184.004c-4.416,0-8,3.576-8,8v64c0,4.424,3.584,8,8,8s8-3.576,8-8v-64C104,187.58,100.416,184.004,96,184.004z" />{" "}
		  <path d="M96,136.004c-4.416,0-8,3.576-8,8v16c0,4.424,3.584,8,8,8s8-3.576,8-8v-16C104,139.58,100.416,136.004,96,136.004z" />{" "}
		  <path d="M400,112.004c-4.424,0-8,3.576-8,8v64c0,4.424,3.576,8,8,8s8-3.576,8-8v-64C408,115.58,404.424,112.004,400,112.004z" />{" "}
		  <path d="M400,64.004c-4.424,0-8,3.576-8,8v16c0,4.424,3.576,8,8,8s8-3.576,8-8v-16C408,67.58,404.424,64.004,400,64.004z" />{" "}
		  <path d="M271.896,207.644l-0.056-7.992c-0.04-6.416-2.568-12.424-7.136-16.928c-4.568-4.496-10.856-7.088-17.016-6.872l-16,0.152 c-0.016,0-0.032,0-0.048,0c-4.384,0-7.976-3.608-8-8l-0.048-8.016c-0.024-4.416,3.536-8.04,7.952-8.064l7.808-0.056 c0.256,0.016,0.48,0.136,0.752,0.136c0.016,0,0.032,0,0.048,0c0.272,0,0.504-0.136,0.768-0.16l22.608-0.144 c4.424-0.032,7.984-3.48,7.952-7.896c-0.032-4.408-3.6-7.8-8-7.8c-0.016,0-0.032,0-0.048,0l-15.384-0.056l-0.048-7.92 c-0.024-4.4-3.608-8.024-8-8.024c-0.016,0-0.032,0-0.048,0c-4.416,0.032-7.976,3.688-7.952,8.104l0.048,7.896h-0.608 c-13.232,0-23.928,10.864-23.848,24.104l0.048,8.024c0.088,13.176,10.84,23.872,24,23.872c0.048,0,0.104,0,0.152,0h16 c0.016,0,0.032,0,0.048,0c2.112,0,4.104,0.72,5.624,2.2c1.512,1.504,2.36,3.456,2.376,5.6l0.056,7.968 c0.032,4.416-3.536,8.016-7.952,8.04l-32,0.2c-4.416,0.032-7.976,3.632-7.952,8.048c0.032,4.4,3.616,7.944,8.008,7.944 c0.016,0,0.032,0,0.048,0l16-0.104l0.048,8.16c0.024,4.4,3.608,7.944,8,7.944c0.016,0,0.032,0,0.048,0 c4.416-0.032,7.984-3.632,7.952-8.056l-0.048-8.152C261.28,231.716,271.976,220.884,271.896,207.644z" />{" "}
		  <circle cx={184} cy="192.004" r={8} />{" "}
		  <circle cx={296} cy="192.004" r={8} />{" "}
		  <path
			style={{ fill: "#95b5df" }}
			d="M472,472.004h-88c-8.84,0-16-7.16-16-16v-120c0-8.84,7.16-16,16-16h88V472.004z"
		  />{" "}
		  <rect
			x="321.44"
			y="336.004"
			style={{ fill: "#F8F8FA" }}
			width="46.576"
			height={120}
		  />{" "}
		  <path
			style={{ fill: "#f0d5d0" }}
			d="M240,391.9h-59.68c-11.224,0-20.32-8.704-20.32-19.6v-0.032c0-8.008,4.992-15.224,12.632-18.256 l62.64-24.856c3.072-1.224,6.464-1.48,9.696-0.744L320,345.436l-0.536,106.016l-75.792,17.384c-2.416,0.552-4.928,0.552-7.344,0 L104,438.62l-88.872-57.512C10.672,378.228,8,373.38,8,368.188v-17.352c0-10.416,10.36-17.88,20.632-14.864L160,374.492"
		  />{" "}
		  <path d="M472,312.004h-88c-10.416,0-19.216,6.712-22.528,16h-40.048c-4.328,0-7.808,3.448-7.952,7.744l-66.744-15.144 c-4.816-1.088-9.816-0.712-14.416,1.12l-62.64,24.848c-8.088,3.208-14.016,9.72-16.456,17.592l-122.328-35.88 c-7.456-2.168-15.28-0.784-21.456,3.84C3.44,336.62,0,343.436,0,350.836v17.352c0,7.936,4.032,15.28,10.776,19.64l88.872,57.512 c0.784,0.504,1.656,0.872,2.568,1.08l132.32,30.216c1.792,0.416,3.632,0.616,5.464,0.616c1.84,0,3.672-0.2,5.464-0.616l69.64-15.976 c1.448,1.976,3.68,3.344,6.328,3.344h40.048c3.312,9.288,12.112,16,22.528,16h88c4.424,0,8-3.576,8-8v-152 C480,315.58,476.424,312.004,472,312.004z M311.496,445.076l-69.616,15.968c-1.224,0.288-2.528,0.288-3.768,0L107.16,431.14 l-87.696-56.752C17.296,372.98,16,370.668,16,368.18v-17.352c0-3.168,1.888-5.048,3.016-5.888c2.112-1.576,4.784-2.072,7.36-1.296 l127.016,37.304c3.728,11.024,14.392,19.056,26.928,19.056H240c4.416,0,8-3.576,8-8s-3.584-8-8-8h-59.68 c-6.792,0-12.32-5.256-12.32-11.68c0-4.752,2.976-9.016,7.584-10.848l62.64-24.864c1.584-0.632,3.312-0.768,4.976-0.392l68.768,15.6 L311.496,445.076z M328,344.004h32v104h-32V344.004z M464,464.004h-80c-4.416,0-8-3.584-8-8v-120c0-4.416,3.584-8,8-8h80V464.004z" />{" "}
		  <path d="M433.432,448.004h-24c-4.424,0-8-3.576-8-8s3.576-8,8-8h24c4.424,0,8,3.576,8,8S437.848,448.004,433.432,448.004z" />{" "}
		</g>
	  </svg>
	  );
}

export function ErrorIcon(props: SVGProps<SVGSVGElement>) {
	return (<svg
		height="256px"
		width="256px"
		version="1.1"
		id="Layer_1"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		viewBox="0 0 512.00 512.00"
		xmlSpace="preserve"
		fill="#000000"
		stroke="#000000"
		strokeWidth="0.00512"
		{...props}
	  >
		<g id="SVGRepo_bgCarrier" strokeWidth={0} />
		<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
		<g id="SVGRepo_iconCarrier">
		  {" "}
		  <polygon
			style={{ fill: "#FF9839" }}
			points="183.156,286.044 237.727,211.191 168.077,143.637 10.2,158.209 31.192,385.631 195.037,370.508 234.85,304.198 "
		  />{" "}
		  <polygon
			style={{ fill: "#9e5400" }}
			points="215.673,189.802 14.827,208.34 19.341,257.248 217.484,238.959 237.727,211.191 "
		  />{" "}
		  <polygon
			style={{ fill: "#FF9839" }}
			points="501.8,157.03 276.869,126.371 329.488,207.895 259.44,268.511 305.707,297.856 251.964,353.477 470.955,383.326 "
		  />{" "}
		  <polygon
			style={{ fill: "#9e5400" }}
			points="495.001,206.913 312.827,182.081 329.488,207.895 303.504,230.381 488.368,255.578 "
		  />{" "}
		  <g>
			{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M245.969,217.2c2.994-4.106,2.507-9.791-1.14-13.329l-69.65-67.553 c-2.137-2.074-5.07-3.113-8.038-2.835L9.262,148.052c-2.694,0.249-5.178,1.557-6.907,3.637c-1.729,2.081-2.561,4.763-2.312,7.457 l20.992,227.421c0.249,2.694,1.556,5.178,3.637,6.907c1.839,1.528,4.147,2.355,6.518,2.355c0.312,0,0.625-0.014,0.937-0.043 l163.847-15.123c3.235-0.299,6.135-2.12,7.806-4.907l39.811-66.31c1.578-2.628,1.891-5.827,0.85-8.711 c-1.04-2.883-3.322-5.147-6.214-6.162l-38.749-13.608L245.969,217.2z M25.921,217.559l186.019-17.169l12.326,11.954l-12.308,16.884 L28.56,246.154L25.921,217.559z M164.344,154.225l28.311,27.458l-168.61,15.564l-2.753-29.818L164.344,154.225z M188.955,360.826 L40.41,374.537l-9.975-108.071l165.511-15.277l-21.031,28.846c-1.9,2.606-2.455,5.957-1.497,9.036 c0.958,3.081,3.316,5.526,6.359,6.595l39.887,14.007L188.955,360.826z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M511.906,158.407c0.761-5.582-3.146-10.722-8.728-11.483l-224.931-30.66 c-3.948-0.536-7.845,1.27-9.983,4.631c-2.138,3.361-2.123,7.659,0.037,11.005l47.813,74.079l-63.347,54.818 c-2.44,2.11-3.736,5.25-3.497,8.467c0.239,3.216,1.985,6.131,4.709,7.857l35.7,22.644l-45.048,46.622 c-2.671,2.764-3.561,6.794-2.302,10.427c1.258,3.632,4.451,6.247,8.259,6.766l218.991,29.85c0.459,0.063,0.919,0.094,1.378,0.094 c2.216,0,4.387-0.723,6.172-2.08c2.153-1.636,3.569-4.061,3.934-6.742L511.906,158.407z M490.317,165.758l-4.044,29.671 l-167.421-22.821l-21.388-33.137L490.317,165.758z M336.161,215.607c3.843-3.326,4.652-8.973,1.895-13.243l-4.636-7.182 l150.096,20.46l-3.879,28.454l-152.394-20.772L336.161,215.607z M462.227,371.843l-188.943-25.754l39.756-41.147 c2.13-2.204,3.156-5.25,2.793-8.294c-0.363-3.044-2.076-5.764-4.665-7.406l-34.681-21.998l30.204-26.136l170.193,23.197 L462.227,371.843z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M456.118,280.618c-5.581-0.753-10.72,3.155-11.476,8.737l-0.414,3.057 c-0.757,5.582,3.155,10.72,8.737,11.476c0.465,0.063,0.926,0.094,1.383,0.094c5.024,0,9.401-3.714,10.093-8.83l0.414-3.057 C465.613,286.512,461.7,281.374,456.118,280.618z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M451.831,312.237c-5.586-0.755-10.72,3.155-11.477,8.736l-3.872,28.557 c-0.757,5.582,3.155,10.72,8.736,11.477c0.465,0.063,0.927,0.094,1.383,0.094c5.024,0,9.4-3.714,10.093-8.829l3.872-28.557 C461.325,318.132,457.413,312.993,451.831,312.237z"
			/>{" "}
		  </g>{" "}
		</g>
	  </svg>
	  
	  );
}

export function ErrorAuthIcon(props: SVGProps<SVGSVGElement>) {
	return (<svg
		height="200px"
		width="200px"
		version="1.1"
		id="Layer_1"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		viewBox="0 0 512.001 512.001"
		xmlSpace="preserve"
		fill="#000000"
		{...props}
	  >
		<g id="SVGRepo_bgCarrier" strokeWidth={0} />
		<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
		<g id="SVGRepo_iconCarrier">
		  {" "}
		  <circle
			style={{ fill: "#FFAD61" }}
			cx="345.726"
			cy="165.132"
			r="154.932"
		  />{" "}
		  <g>
			{" "}
			<path
			  style={{ fill: "#D35B38" }}
			  d="M213.098,345.502L66.188,492.411c-12.547,12.547-32.889,12.547-45.436,0l0,0 c-12.547-12.547-12.547-32.889,0-45.436l146.91-146.909L213.098,345.502z"
			/>{" "}
			<path
			  style={{ fill: "#D35B38" }}
			  d="M356.715,74.115c0,0-2.402,4.644,7.206,9.608c3.912,2.021,11.088,3.989,18.223,5.612l0.686-10.523 c0.945-14.508-10.567-26.794-25.104-26.794h-23.158c-14.539,0-26.05,12.286-25.103,26.794l1.029,15.782 C346.98,92.565,356.715,74.115,356.715,74.115z"
			/>{" "}
		  </g>{" "}
		  <path
			style={{ fill: "#FFE6B8" }}
			d="M363.919,83.722c-9.608-4.964-7.206-9.608-7.206-9.608s-9.734,18.45-46.222,20.479l2.403,36.854 c0.741,11.353,7.223,21.545,17.192,27.028l0,0c9.999,5.5,22.117,5.5,32.116,0l0,0c9.969-5.483,16.452-15.674,17.192-27.028 l2.747-42.114C375.008,87.712,367.832,85.744,363.919,83.722z"
		  />{" "}
		  <path
			style={{ fill: "#BCC987" }}
			d="M437.905,233.602c-4.113-22.707-21.838-40.027-43.84-44.169c-3.311-0.623-6.717-0.952-10.189-0.952 h-11.551l-26.179,26.179l-26.179-26.179h-11.55c-3.473,0-6.88,0.328-10.189,0.952c-22.002,4.143-39.726,21.462-43.84,44.169l0,0 c-1.997,11.026,6.475,21.17,17.68,21.17h148.159C431.431,254.773,439.903,244.628,437.905,233.602L437.905,233.602z"
		  />{" "}
		  <path
			id="SVGCleanerId_0"
			style={{ fill: "#4D3D36" }}
			d="M345.731,0c-91.052,0-165.128,74.077-165.128,165.128 c0,42.225,15.939,80.794,42.108,110.023l-32.769,32.769l-15.067-15.067c-3.983-3.982-10.441-3.982-14.425,0L13.541,439.762 c-7.994,7.994-12.398,18.624-12.398,29.931c0,11.305,4.403,21.935,12.398,29.931c8.251,8.251,19.091,12.377,29.93,12.377 s21.678-4.126,29.931-12.377L220.31,352.715c3.983-3.983,3.983-10.441,0-14.425l-15.944-15.944l32.854-32.854 c29.04,25.372,67.01,40.765,108.511,40.765c91.052,0,165.128-74.077,165.128-165.128S436.782,0,345.731,0z M58.977,485.198 c-8.549,8.55-22.462,8.55-31.012,0c-4.142-4.142-6.423-9.649-6.423-15.505c0-5.858,2.281-11.364,6.423-15.505l139.697-139.697 l31.012,31.011L58.977,485.198z M345.731,309.857c-79.804,0-144.728-64.925-144.728-144.728S265.927,20.399,345.731,20.399 s144.728,64.925,144.728,144.728S425.535,309.857,345.731,309.857z"
		  />{" "}
		  <path
			id="SVGCleanerId_1"
			style={{ fill: "#4D3D36" }}
			d="M300.315,95.258l2.403,36.854c0.972,14.906,9.366,28.103,22.455,35.302 c6.566,3.611,13.769,5.417,20.973,5.417s14.407-1.806,20.973-5.418c13.088-7.199,21.482-20.395,22.455-35.301l2.746-42.113 l0.686-10.522c0.633-9.718-2.822-19.367-9.48-26.475c-6.66-7.108-16.064-11.184-25.803-11.184h-23.158 c-9.739,0-19.143,4.076-25.801,11.183c-6.658,7.107-10.115,16.757-9.481,26.474L300.315,95.258z M357.289,149.538 c-6.978,3.839-15.309,3.838-22.285,0.001c-6.953-3.825-11.413-10.836-11.929-18.755l-1.765-27.049 c16.326-2.418,27.119-8.008,33.97-13.308c1.203,0.829,2.522,1.615,3.957,2.356c2.839,1.467,6.858,2.915,12.172,4.385l-2.192,33.617 C368.701,138.703,364.242,145.715,357.289,149.538z M372.658,76.251c-2.29-0.755-3.488-1.296-4.056-1.591 c-0.385-0.199-0.703-0.379-0.991-0.551l2.166-5.778C371.49,70.653,372.488,73.374,372.658,76.251z M323.651,66.948 c2.859-3.051,6.735-4.731,10.916-4.731h15.717l-2.756,7.351c-1.445,2.048-8.456,10.502-27.549,13.74l-0.337-5.16 C319.37,73.977,320.794,69.999,323.651,66.948z"
		  />{" "}
		  <path
			id="SVGCleanerId_2"
			style={{ fill: "#4D3D36" }}
			d="M447.942,231.784c-4.777-26.37-25.669-47.419-51.991-52.377 c-3.976-0.747-8.038-1.126-12.074-1.126h-11.551c-2.705,0-5.3,1.075-7.212,2.987l-18.967,18.967l-18.966-18.967 c-1.912-1.912-4.507-2.987-7.212-2.987h-11.551c-4.036,0-8.097,0.379-12.077,1.127c-26.318,4.956-47.211,26.004-51.988,52.376 c-1.492,8.239,0.73,16.65,6.097,23.077c5.367,6.427,13.246,10.112,21.619,10.112h148.159c8.373,0,16.253-3.685,21.62-10.112 C447.213,248.434,449.434,240.022,447.942,231.784z M426.188,241.785c-0.87,1.041-2.801,2.789-5.963,2.789H272.067 c-3.162,0-5.093-1.747-5.963-2.789c-0.87-1.041-2.245-3.253-1.682-6.364c3.281-18.109,17.624-32.563,35.688-35.965 c2.738-0.515,5.531-0.776,8.306-0.776h7.326l23.191,23.192c1.912,1.912,4.507,2.987,7.212,2.987c2.705,0,5.3-1.075,7.212-2.987 l23.192-23.192h7.326c2.774,0,5.568,0.261,8.302,0.775c18.068,3.403,32.41,17.856,35.691,35.965 C428.433,238.531,427.058,240.742,426.188,241.785z"
		  />{" "}
		  <path
			id="SVGCleanerId_3"
			style={{ fill: "#4D3D36" }}
			d="M116.703,378.333c-3.983,3.983-3.983,10.441,0,14.425 c1.992,1.991,4.602,2.987,7.212,2.987s5.221-0.996,7.212-2.987l44.368-44.368c3.983-3.983,3.983-10.441,0-14.425 c-3.983-3.982-10.441-3.982-14.425,0L116.703,378.333z"
		  />{" "}
		  <path
			id="SVGCleanerId_4"
			style={{ fill: "#4D3D36" }}
			d="M94.774,399.943l-4.909,4.909c-3.983,3.983-3.983,10.441,0,14.425 c1.992,1.991,4.602,2.987,7.212,2.987s5.221-0.996,7.212-2.987l4.909-4.909c3.983-3.983,3.983-10.441,0-14.425 C105.216,395.961,98.757,395.961,94.774,399.943z"
		  />{" "}
		  <g>
			{" "}
			<path
			  id="SVGCleanerId_0_1_"
			  style={{ fill: "#4D3D36" }}
			  d="M345.731,0c-91.052,0-165.128,74.077-165.128,165.128 c0,42.225,15.939,80.794,42.108,110.023l-32.769,32.769l-15.067-15.067c-3.983-3.982-10.441-3.982-14.425,0L13.541,439.762 c-7.994,7.994-12.398,18.624-12.398,29.931c0,11.305,4.403,21.935,12.398,29.931c8.251,8.251,19.091,12.377,29.93,12.377 s21.678-4.126,29.931-12.377L220.31,352.715c3.983-3.983,3.983-10.441,0-14.425l-15.944-15.944l32.854-32.854 c29.04,25.372,67.01,40.765,108.511,40.765c91.052,0,165.128-74.077,165.128-165.128S436.782,0,345.731,0z M58.977,485.198 c-8.549,8.55-22.462,8.55-31.012,0c-4.142-4.142-6.423-9.649-6.423-15.505c0-5.858,2.281-11.364,6.423-15.505l139.697-139.697 l31.012,31.011L58.977,485.198z M345.731,309.857c-79.804,0-144.728-64.925-144.728-144.728S265.927,20.399,345.731,20.399 s144.728,64.925,144.728,144.728S425.535,309.857,345.731,309.857z"
			/>{" "}
		  </g>{" "}
		  <g>
			{" "}
			<path
			  id="SVGCleanerId_1_1_"
			  style={{ fill: "#4D3D36" }}
			  d="M300.315,95.258l2.403,36.854c0.972,14.906,9.366,28.103,22.455,35.302 c6.566,3.611,13.769,5.417,20.973,5.417s14.407-1.806,20.973-5.418c13.088-7.199,21.482-20.395,22.455-35.301l2.746-42.113 l0.686-10.522c0.633-9.718-2.822-19.367-9.48-26.475c-6.66-7.108-16.064-11.184-25.803-11.184h-23.158 c-9.739,0-19.143,4.076-25.801,11.183c-6.658,7.107-10.115,16.757-9.481,26.474L300.315,95.258z M357.289,149.538 c-6.978,3.839-15.309,3.838-22.285,0.001c-6.953-3.825-11.413-10.836-11.929-18.755l-1.765-27.049 c16.326-2.418,27.119-8.008,33.97-13.308c1.203,0.829,2.522,1.615,3.957,2.356c2.839,1.467,6.858,2.915,12.172,4.385l-2.192,33.617 C368.701,138.703,364.242,145.715,357.289,149.538z M372.658,76.251c-2.29-0.755-3.488-1.296-4.056-1.591 c-0.385-0.199-0.703-0.379-0.991-0.551l2.166-5.778C371.49,70.653,372.488,73.374,372.658,76.251z M323.651,66.948 c2.859-3.051,6.735-4.731,10.916-4.731h15.717l-2.756,7.351c-1.445,2.048-8.456,10.502-27.549,13.74l-0.337-5.16 C319.37,73.977,320.794,69.999,323.651,66.948z"
			/>{" "}
		  </g>{" "}
		  <g>
			{" "}
			<path
			  id="SVGCleanerId_2_1_"
			  style={{ fill: "#4D3D36" }}
			  d="M447.942,231.784c-4.777-26.37-25.669-47.419-51.991-52.377 c-3.976-0.747-8.038-1.126-12.074-1.126h-11.551c-2.705,0-5.3,1.075-7.212,2.987l-18.967,18.967l-18.966-18.967 c-1.912-1.912-4.507-2.987-7.212-2.987h-11.551c-4.036,0-8.097,0.379-12.077,1.127c-26.318,4.956-47.211,26.004-51.988,52.376 c-1.492,8.239,0.73,16.65,6.097,23.077c5.367,6.427,13.246,10.112,21.619,10.112h148.159c8.373,0,16.253-3.685,21.62-10.112 C447.213,248.434,449.434,240.022,447.942,231.784z M426.188,241.785c-0.87,1.041-2.801,2.789-5.963,2.789H272.067 c-3.162,0-5.093-1.747-5.963-2.789c-0.87-1.041-2.245-3.253-1.682-6.364c3.281-18.109,17.624-32.563,35.688-35.965 c2.738-0.515,5.531-0.776,8.306-0.776h7.326l23.191,23.192c1.912,1.912,4.507,2.987,7.212,2.987c2.705,0,5.3-1.075,7.212-2.987 l23.192-23.192h7.326c2.774,0,5.568,0.261,8.302,0.775c18.068,3.403,32.41,17.856,35.691,35.965 C428.433,238.531,427.058,240.742,426.188,241.785z"
			/>{" "}
		  </g>{" "}
		  <g>
			{" "}
			<path
			  id="SVGCleanerId_3_1_"
			  style={{ fill: "#4D3D36" }}
			  d="M116.703,378.333c-3.983,3.983-3.983,10.441,0,14.425 c1.992,1.991,4.602,2.987,7.212,2.987s5.221-0.996,7.212-2.987l44.368-44.368c3.983-3.983,3.983-10.441,0-14.425 c-3.983-3.982-10.441-3.982-14.425,0L116.703,378.333z"
			/>{" "}
		  </g>{" "}
		  <g>
			{" "}
			<path
			  id="SVGCleanerId_4_1_"
			  style={{ fill: "#4D3D36" }}
			  d="M94.774,399.943l-4.909,4.909c-3.983,3.983-3.983,10.441,0,14.425 c1.992,1.991,4.602,2.987,7.212,2.987s5.221-0.996,7.212-2.987l4.909-4.909c3.983-3.983,3.983-10.441,0-14.425 C105.216,395.961,98.757,395.961,94.774,399.943z"
			/>{" "}
		  </g>{" "}
		</g>
	  </svg>
	  );
}

export function CategoryLiabilityIcon(props: SVGProps<SVGSVGElement>) {
	return (<svg
		version="1.1"
		id="Layer_1"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		viewBox="0 0 512.001 512.001"
		xmlSpace="preserve"
		fill="#000000"
		{...props}
	  >
		<g id="SVGRepo_bgCarrier" strokeWidth={0} />
		<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
		<g id="SVGRepo_iconCarrier">
		  {" "}
		  <rect
			x="199.67"
			y="255.308"
			style={{ fill: "#FF9839" }}
			width="112.65"
			height="246.495"
		  />{" "}
		  <rect
			x="39.357"
			y="109.918"
			style={{ fill: "#FFD890" }}
			width="112.65"
			height="391.885"
		  />{" "}
		  <rect
			x="359.992"
			y="411.294"
			style={{ fill: "#DB4417" }}
			width="112.65"
			height="90.508"
		  />{" "}
		  <g>
			{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M312.328,245.109H199.674c-5.633,0-10.199,4.567-10.199,10.199v246.493 c0,5.632,4.566,10.199,10.199,10.199h112.656c5.632,0,10.199-4.567,10.199-10.199V255.309 C322.527,249.677,317.961,245.109,312.328,245.109z M302.129,491.602h-92.257V265.508h92.257V491.602z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M152.012,99.718H39.356c-5.633,0-10.199,4.567-10.199,10.199v391.884 c0,5.632,4.566,10.199,10.199,10.199H152.01c5.633,0,10.199-4.567,10.199-10.199V109.918 C162.211,104.285,157.645,99.718,152.012,99.718z M141.812,491.602H49.555V120.117h92.256v371.485H141.812z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M472.645,401.093H359.99c-5.632,0-10.199,4.567-10.199,10.199v90.509 c0,5.632,4.567,10.199,10.199,10.199h112.655c5.632,0,10.199-4.567,10.199-10.199v-90.509 C482.844,405.66,478.277,401.093,472.645,401.093z M462.445,491.602h-92.256v-70.11h92.256V491.602z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M407.238,291.746h-32.404c-5.632,0-10.199,4.567-10.199,10.199s4.567,10.199,10.199,10.199h57.771 c5.632,0,10.199-4.567,10.199-10.199v-57.771c0-5.632-4.567-10.199-10.199-10.199c-5.632,0-10.199,4.567-10.199,10.199v33.869 L139.301,2.885c-4.039-3.926-10.497-3.833-14.423,0.205c-3.927,4.039-3.834,10.496,0.205,14.423L407.238,291.746z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M70.375,479.363c5.633,0,10.199-4.567,10.199-10.199V365.132c0-5.632-4.566-10.199-10.199-10.199 s-10.199,4.567-10.199,10.199v104.032C60.176,474.797,64.742,479.363,70.375,479.363z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M70.375,341.673c5.633,0,10.199-4.567,10.199-10.199v-5.1c0-5.632-4.566-10.199-10.199-10.199 s-10.199,4.567-10.199,10.199v5.1C60.176,337.107,64.742,341.673,70.375,341.673z"
			/>{" "}
		  </g>{" "}
		</g>
	  </svg>
	  );
}

export function CategoryOtherAssetsIcon(props: SVGProps<SVGSVGElement>) {
	return (<svg
		height="200px"
		width="200px"
		version="1.1"
		id="Layer_1"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		viewBox="0 0 512 512"
		xmlSpace="preserve"
		fill="#000000"
		{...props}
	  >
		<g id="SVGRepo_bgCarrier" strokeWidth={0} />
		<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
		<g id="SVGRepo_iconCarrier">
		  {" "}
		  <path
			style={{ fill: "#eec79b" }}
			d="M197.167,10.199h-80.851L10.199,116.316v80.851l304.634,304.634l186.968-186.968L197.167,10.199z M92.133,126.783c-9.569-9.569-9.569-25.082,0-34.651s25.082-9.569,34.651,0s9.569,25.082,0,34.651S101.701,136.352,92.133,126.783z "
		  />{" "}
		  <g>
			{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M314.834,512c-2.705,0-5.298-1.075-7.212-2.987L2.987,204.379C1.075,202.466,0,199.872,0,197.167 v-80.851c0-2.705,1.075-5.3,2.987-7.212L109.104,2.987C111.016,1.075,113.611,0,116.316,0h80.851c2.705,0,5.299,1.075,7.212,2.987 l304.634,304.634c3.983,3.983,3.983,10.441,0,14.425L322.046,509.013C320.133,510.925,317.539,512,314.834,512z M20.399,192.942 l294.436,294.435l172.543-172.544L192.943,20.398H120.54L20.399,120.54V192.942z M109.458,144.142 c-8.886,0-17.772-3.382-24.537-10.147c-6.554-6.554-10.164-15.268-10.164-24.537s3.611-17.983,10.165-24.537 c6.554-6.554,15.267-10.164,24.537-10.164c9.269,0,17.983,3.61,24.537,10.164c13.53,13.53,13.53,35.544,0,49.074 C127.23,140.76,118.345,144.142,109.458,144.142z M109.458,95.156c-3.821,0-7.412,1.488-10.114,4.189 c-2.702,2.702-4.19,6.293-4.19,10.114c0,3.821,1.488,7.412,4.19,10.114c5.576,5.576,14.649,5.577,20.227,0 c5.576-5.576,5.576-14.65,0-20.226C116.87,96.644,113.279,95.156,109.458,95.156z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M342.622,347.119c-27.21,26.782-58.278,27.426-65.991,19.712c-3.428-3.429-4.713-11.142-1.5-14.355 c5.142-5.142,26.783,7.071,53.993-18.854l-62.349-62.349c-25.497,12.213-52.064,25.925-79.49-1.499 c-26.997-26.997-15.213-55.922,2.143-75.847l-6.643-6.643c-2.143-2.143-1.929-6.213,0.857-8.999c2.357-2.357,6.857-3,8.999-0.858 l6.213,6.213c16.07-14.783,38.566-26.567,45.637-19.497c2.785,2.785,5.571,10.285,1.714,14.141s-17.355,3.214-34.282,18.426 l53.136,53.136c24.211-11.355,51.851-20.997,81.204,8.356c25.924,25.925,24.211,54.207,5.571,78.419l8.355,8.355 c2.143,2.143,1.499,6.642-0.858,8.999c-2.784,2.785-6.857,3-8.999,0.857L342.622,347.119z M252.42,256.059l-49.708-49.708 c-12.427,14.57-19.068,32.782-3.214,48.637C216.21,271.7,233.565,265.058,252.42,256.059z M279.415,265.486l58.493,58.492 c12.642-17.355,11.784-34.924-4.07-50.779C315.197,254.56,297.627,257.987,279.415,265.486z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M271.299,140.239c-2.611,0-5.22-0.995-7.212-2.987l-59.155-59.155 c-3.983-3.983-3.983-10.441,0-14.425s10.441-3.983,14.425,0l59.155,59.155c3.983,3.983,3.983,10.441,0,14.425 C276.519,139.244,273.91,140.239,271.299,140.239z"
			/>{" "}
			<path
			  style={{ fill: "#4C1D1D" }}
			  d="M187.665,56.607c-2.61,0-5.221-0.995-7.212-2.987l-2.55-2.55c-3.983-3.983-3.983-10.441,0-14.425 c3.983-3.983,10.441-3.983,14.425,0l2.55,2.55c3.983,3.983,3.983,10.441,0,14.425C192.886,55.611,190.276,56.607,187.665,56.607z"
			/>{" "}
		  </g>{" "}
		</g>
	  </svg>
	  );
}

export function CategoryMerchantIcon(props: SVGProps<SVGSVGElement>) {
	return (<svg
		height="200px"
		width="200px"
		version="1.1"
		id="Layer_1"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		viewBox="0 0 512 512"
		xmlSpace="preserve"
		fill="#000000"
		{...props}
	  >
		<g id="SVGRepo_bgCarrier" strokeWidth={0} />
		<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
		<g id="SVGRepo_iconCarrier">
		  {" "}
		  <circle style={{ fill: "#dbdbdb" }} cx={256} cy={256} r="245.801" />{" "}
		  <g>
			{" "}
			<path
			  style={{ fill: "#FFE6B8" }}
			  d="M256,411.538c-14.082,0-25.498-11.416-25.498-25.498V208.574c0-14.082,11.416-25.498,25.498-25.498 c14.082,0,25.498,11.416,25.498,25.498V386.04C281.498,400.122,270.082,411.538,256,411.538z"
			/>{" "}
			<path
			  style={{ fill: "#FFE6B8" }}
			  d="M256,151.458c-6.711,0-13.28-2.723-18.033-7.466c-4.742-4.753-7.465-11.321-7.465-18.032 s2.723-13.29,7.465-18.033c4.753-4.742,11.322-7.465,18.033-7.465c6.711,0,13.279,2.723,18.032,7.465 c4.743,4.743,7.466,11.322,7.466,18.033s-2.723,13.279-7.466,18.032C269.279,148.735,262.711,151.458,256,151.458z"
			/>{" "}
		  </g>{" "}
		  <g>
			{" "}
			<path
			  style={{ fill: "#4D3D36" }}
			  d="M256,512c-68.381,0-132.667-26.628-181.019-74.981C26.628,388.667,0,324.381,0,256 S26.628,123.333,74.981,74.981C123.333,26.628,187.619,0,256,0s132.667,26.628,181.019,74.981C485.372,123.333,512,187.619,512,256 s-26.628,132.667-74.981,181.019C388.667,485.372,324.381,512,256,512z M256,20.398C126.089,20.398,20.398,126.089,20.398,256 S126.089,491.602,256,491.602S491.602,385.911,491.602,256S385.911,20.398,256,20.398z"
			/>{" "}
			<path
			  style={{ fill: "#4D3D36" }}
			  d="M430.023,383.95c-1.97,0-3.961-0.57-5.715-1.758c-4.662-3.162-5.88-9.503-2.719-14.166 c12.984-19.151,22.453-40.188,28.142-62.528c1.388-5.46,6.936-8.759,12.4-7.367c5.46,1.389,8.757,6.943,7.367,12.4 c-6.272,24.634-16.711,47.83-31.024,68.94C436.502,382.382,433.291,383.95,430.023,383.95z"
			/>{" "}
			<path
			  style={{ fill: "#4D3D36" }}
			  d="M465.914,275.378c-0.149,0-0.298-0.003-0.448-0.01c-5.628-0.243-9.993-5.002-9.749-10.63 c0.124-2.883,0.188-5.824,0.188-8.739c0-5.632,4.567-10.199,10.199-10.199c5.632,0,10.199,4.567,10.199,10.199 c0,3.208-0.069,6.444-0.207,9.62C475.859,271.097,471.344,275.378,465.914,275.378z"
			/>{" "}
			<path
			  style={{ fill: "#4D3D36" }}
			  d="M256,421.737c-19.683,0-35.697-16.014-35.697-35.697V208.574c0-19.683,16.014-35.697,35.697-35.697 c19.683,0,35.697,16.014,35.697,35.697V386.04C291.697,405.723,275.683,421.737,256,421.737z M256,193.275 c-8.436,0-15.299,6.863-15.299,15.299V386.04c0,8.436,6.863,15.299,15.299,15.299c8.436,0,15.299-6.863,15.299-15.299V208.574 C271.299,200.138,264.436,193.275,256,193.275z"
			/>{" "}
			<path
			  style={{ fill: "#4D3D36" }}
			  d="M256,161.657c-9.386,0-18.585-3.807-25.237-10.446c-6.654-6.668-10.46-15.867-10.46-25.251 c0-9.4,3.809-18.6,10.451-25.244c6.662-6.647,15.861-10.453,25.246-10.453c9.384,0,18.583,3.806,25.235,10.444 c6.653,6.652,10.462,15.853,10.462,25.253c0,9.385-3.807,18.584-10.446,25.236C274.584,157.85,265.385,161.657,256,161.657z M256,110.661c-4.025,0-7.972,1.636-10.829,4.486c-2.836,2.837-4.469,6.781-4.469,10.813c0,4.024,1.636,7.971,4.486,10.829 c2.841,2.834,6.788,4.47,10.813,4.47c4.024,0,7.97-1.636,10.827-4.486c2.835-2.843,4.471-6.789,4.471-10.813 c0-4.031-1.633-7.974-4.479-10.82C263.971,112.297,260.024,110.661,256,110.661z"
			/>{" "}
		  </g>{" "}
		</g>
	  </svg>
	  );
}


export function SolarMenuDotsBoldDuotone(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={1024} height={1024} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M7 12a2 2 0 1 1-4 0a2 2 0 0 1 4 0m14 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0"></path><path fill="currentColor" d="M14 12a2 2 0 1 1-4 0a2 2 0 0 1 4 0" opacity={0.5}></path></svg>);
}