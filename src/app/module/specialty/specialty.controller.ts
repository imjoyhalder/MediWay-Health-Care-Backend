/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { SpecialtyService } from "./specialty.service";

const createSpecialty = async (req: Request, res: Response) => {
    try {
        const payload = req.body

        const result = await SpecialtyService.createSpecialty(payload)
        res.json({
            success: true,
            message: "Specialty created successfully",
            data: result
        })
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to create specialty",
            error: error.message
        })
    }
}

const getAllSpecialty = async (req: Request, res: Response) => {
    try {
        const result = await SpecialtyService.getAllSpecialty()
        res.json({
            success: true,
            message: "Specialties retrieved successfully",
            data: result
        })
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve specialties",
            error: error.message
        })
    }
}

const deleteSpecialty = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const result = await SpecialtyService.deleteSpecialty(id as string)
        res.json({
            success: true,
            message: "Specialty deleted successfully",
            data: result
        })
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete specialty",
            error: error.message
        })
    }
}

const updateSpecialty = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const payload = req.body
        const result = await SpecialtyService.updateSpecialty(id as string, payload)
        res.json({
            success: true,
            message: "Specialty updated successfully",
            data: result
        })
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to update specialty",
            error: error.message
        })
    }
}

    export const SpecialtyController = {
        createSpecialty,
        getAllSpecialty,
        deleteSpecialty, 
        updateSpecialty
    }