import type { LiveOpportunitiesResponse } from '../types';

export const MOCK_OPPORTUNITIES: LiveOpportunitiesResponse = {
  feed: [
    {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      type: "opportunity",
      content: {
        project_name: "Mindanao Railway Project - Phase 1",
        country: "Philippines",
        sector: "Digital Infrastructure",
        value: "$1.5 Billion",
        summary: "Development of the first phase of the Mindanao Railway, focusing on a 102-kilometer segment to boost connectivity and trade in the region. Includes modernizing signaling and communication systems.",
        source_url: "https://www.mdapress.com.ph/press-release/article/p3-9b-mrp-tagum-davao-digos-segment-construction-eyed-in-q1-2025",
        ai_feasibility_score: 85,
        ai_risk_assessment: "High local government support and strategic national importance, but potential for land acquisition delays and security concerns in specific areas."
      }
    },
    {
        id: "a2b3c4d5-e6f7-4a8b-9c1d-2e3f4a5b6c7d",
        timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        type: "news",
        content: {
            headline: "UK launches £1bn fund to bolster semiconductor industry",
            source: "Financial Times",
            summary: "The UK government has unveiled a new national strategy for semiconductors, backed by a £1 billion investment over the next decade to boost research, design, and manufacturing capabilities.",
            link: "https://www.gov.uk/government/publications/national-semiconductor-strategy",
            region: "Europe"
        }
    },
    {
        id: "1a2b3c4d-5e6f-7a8b-9c1d-2e3f4a5b6c7e",
        timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
        type: "indicator",
        content: {
            name: "Global FDI Inflows",
            value: "$1.29 Trillion",
            change: -12.4,
            region: "Global"
        }
    },
    {
      id: "b8e9f0a1-b2c3-4d5e-6f7a-8b9c0d1e2f3a",
      timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      type: "opportunity",
      content: {
        project_name: "Green Hydrogen Development Program",
        country: "Chile",
        sector: "Clean Technology & Renewable Energy",
        value: "$50 Million Initial Grant",
        summary: "A program to leverage Chile's exceptional solar resources for green hydrogen production. The initiative seeks partners for electrolysis technology, storage solutions, and establishing export corridors.",
        source_url: "https://www.investchile.gob.cl/key-industries/green-hydrogen/",
        ai_feasibility_score: 92,
        ai_risk_assessment: "Excellent renewable energy potential and supportive regulatory framework. Market development risk exists, as global hydrogen demand and infrastructure are still maturing."
      }
    },
    {
        id: "c4d5e6f7-a8b9-c1d2-e3f4-a5b6c7d8e9f0",
        timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        type: "opportunity",
        content: {
            project_name: "Vietnam AgriTech Transformation Initiative",
            country: "Vietnam",
            sector: "Agriculture & Aquaculture Technology (AgriTech)",
            value: "$300 Million (World Bank Loan)",
            summary: "A national initiative to modernize Vietnam's agricultural sector through technology. Focus areas include precision farming, IoT sensors for water management, and supply chain traceability using blockchain.",
            source_url: "https://www.worldbank.org/en/country/vietnam/brief/powering-vietnams-agriculture-with-innovation-and-technology",
            ai_feasibility_score: 88,
            ai_risk_assessment: "Strong government backing and a large, established agricultural sector. Challenges include fragmented land ownership and the need for extensive farmer training and adoption programs."
        }
    },
    {
      id: "d5e6f7a8-b9c1-d2e3-f4a5-b6c7d8e9f0a1",
      timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      type: "news",
      content: {
        headline: "World Bank approves $500M for Kenya's digital economy",
        source: "Reuters",
        summary: "The World Bank has approved a $500 million loan for Kenya to advance its digital economy, focusing on expanding broadband access and enhancing digital skills for the youth.",
        link: "https://www.ict.go.ke/digital-master-plan-2022-2032/",
        region: "Sub-Saharan Africa"
      }
    }
  ]
};
