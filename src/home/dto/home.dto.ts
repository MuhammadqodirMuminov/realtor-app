import { PropertyType } from "@prisma/client"
import { Type } from "class-transformer"
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator"

export class HomeResponceDto {
	id: number
	address: string
	number_of_badroms: number
	number_of_bathroms: number
	city: string
	listed_date: Date
	price: number
	land_size: number
	propertyType: PropertyType
	created_at: Date
	updated_at: Date
	realtor_id: number
}

class Image {
	@IsString()
	@IsNotEmpty()
	url: string
}

export class BodyAddHomeDto {
	@IsString()
	@IsNotEmpty()
	address: string

	@IsNotEmpty()
	@IsNumber()
	number_of_badroms: number

	@IsNotEmpty()
	@IsNumber()
	number_of_bathroms: number

	@IsString()
	@IsNotEmpty()
	city: string

	@IsPositive()
	@IsNotEmpty()
	price: number

	@IsPositive()
	@IsNotEmpty()
	land_size: number

	@IsArray()
	@ValidateNested()
	@Type(() => Image)
	images: Image[]

	@IsEnum(PropertyType)
	propertyType: PropertyType
}

export class UpdateHomeDto {
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	address: string

	@IsOptional()
	@IsNotEmpty()
	@IsNumber()
	number_of_badroms: number

	@IsOptional()
	@IsNotEmpty()
	@IsNumber()
	number_of_bathroms: number

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	city: string

	@IsOptional()
	@IsPositive()
	@IsNotEmpty()
	price: number

	@IsOptional()
	@IsPositive()
	@IsNotEmpty()
	land_size: number

	@IsOptional()
	@IsEnum(PropertyType)
	propertyType: PropertyType
}

export class MessageBodyDto {
	@IsString()
	@IsNotEmpty()
	mesage : string
}