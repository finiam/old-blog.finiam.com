export interface Author {
	name: string;
	role: string;
	image: {
		asset: {
			url: string;
		};
	};
}

export interface Post {
	slug: {
		current: string;
	};
	title: string;
	description: string;
	keywords: string;
	longDescription: string;
	featuredImage: {
		asset: {
			url: string;
		};
	};
	// no body on the post list
	body?: string;
	featuredImageAlt: string;
	category: string;
	publishedAt: string;
	author: Author;
}
