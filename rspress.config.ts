import * as path from 'path';
import { defineConfig } from 'rspress/config';
import katex from 'rspress-plugin-katex';
export default defineConfig({
	root: path.join(__dirname, 'docs'),
	title: '文档唠唠叨叨',
	description: '记录开发过程中的唠唠叨叨',
	icon: '/rspress-icon.png',
	logo: {
		light: '/rspress-light-logo.png',
		dark: '/rspress-dark-logo.png',
	},
	themeConfig: {
		socialLinks: [
			{ icon: 'github', mode: 'link', content: 'https://github.com/web-infra-dev/rspress' },
		],
	},
	base: '/my_docs',
	plugins: [katex()],
});
