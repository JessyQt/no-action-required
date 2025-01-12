import axios from "axios";
import { ApiResponse, ScanResult } from "../types";
import { mapScanResultFromApi } from "../utils/mappers";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class AccessibilityApi {
  private static instance: AccessibilityApi;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = API_URL;
  }

  public static getInstance(): AccessibilityApi {
    if (!AccessibilityApi.instance) {
      AccessibilityApi.instance = new AccessibilityApi();
    }
    return AccessibilityApi.instance;
  }

  async analyzeSite(url: string): Promise<ScanResult> {
    try {
      const response = await axios.post<ApiResponse>(
        `${this.baseUrl}/api/analyze`,
        { url },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      return mapScanResultFromApi(response.data);
    } catch (error) {
      console.error("Error analyzing site:", error);
      throw new Error("Failed to analyze site. Please try again later.");
    }
  }

  async analyzeDocument(file: File): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `${this.baseUrl}/api/analyze-document-upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error analyzing document:", error);
      throw new Error("Failed to analyze document. Please try again later.");
    }
  }
}

export const accessibilityApi = AccessibilityApi.getInstance();