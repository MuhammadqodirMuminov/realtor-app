import { PropertyType } from "@prisma/client";

export interface IFilters {
	city?: string;
	price?: {
		gte?: number
		lte?: number
	}
	propertyType: PropertyType;
}

export interface ICreateHome {
	address: string
	number_of_badroms: number
	number_of_bathroms: number
	city: string
	price: number
	land_size: number
	propertyType: PropertyType,
	images: {
		url: string
	}[]
}

export interface IUpdateHome {
	address?: string
	number_of_badroms?: number
	number_of_bathroms?: number
	city?: string
	price?: number
	land_size?: number
	propertyType?: PropertyType,
}