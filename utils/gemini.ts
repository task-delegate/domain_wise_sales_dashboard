import Groq from 'groq-sdk';
import { ColumnMapping, OrderData, PptSlide, Kpi } from '../types';

export async function analyzeCsvData(headers: string[], sampleData: OrderData[]): Promise<ColumnMapping> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Groq API key not found. Please set VITE_GROQ_API_KEY in .env.local");
  }
  const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

  const prompt = `
    You are an expert data analyst. Your primary goal is to identify columns in a CSV file that represent key business metrics for a sales and logistics dashboard.
    Here are the column headers: ${headers.join(', ')}
    Here is a sample of the data (first 5 rows): ${JSON.stringify(sampleData, null, 2)}
    
    Analyze the headers and data to find the best match for each of the following metrics.
    1.  **revenue**: Look for total sale amount. Common names: 'final amount', 'total_price', 'revenue', 'sale_amount'.
    2.  **price**: Price per item.
    3.  **quantity**: Number of items sold.
    4.  **date**: The primary date of the transaction. Look for 'order date', 'created on'.
    5.  **customer**: The customer's name or ID.
    6.  **item**: The product's descriptive name.
    7.  **city**: The shipping or customer city.
    8.  **state**: The shipping or customer state.
    9.  **zipcode**: The shipping or customer zipcode/pincode.
    10. **brand**: The product's brand name.
    11. **orderStatus**: The current status of the order.
    12. **cancellationReason**: The reason an order was cancelled. Look for 'cancellation reason', 'reason'.
    13. **courier**: The shipping partner or courier service.
    14. **sku**: The product's Stock Keeping Unit identifier.
    15. **articleType**: The general category of the product.
    16. **discount**: The discount percentage applied.
    17. **orderId**: The unique identifier for the order. Look for 'order id', 'transaction id', 'order_number'.
    
    **CRITICAL NEW FIELDS**:
    18. **deliveredDate**: Look for a column indicating when the item was delivered. Look for "delivered on", "delivery date", "delivered_at".
    19. **cancelledDate**: Look for a column indicating when the item was cancelled. Look for "cancelled on", "cancellation date", "cancelled_at".
    20. **returnDate**: Look for a column indicating when a return was created. Look for "return creation date", "return date", "returned_on".

    Return ONLY a valid JSON object with the mappings. Use null for fields that cannot be found. Do not include any extra text.
    Example format: {"date": "Order Date", "customer": "Customer Name", ...}
  `;

  try {
    const message = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 1024,
    });
    
    const parsedText = (message.choices[0]?.message?.content || '').trim();
    console.log("Groq response:", parsedText);
    
    if (!parsedText) {
      throw new Error("Groq API returned empty response. Please try again.");
    }
    
    // Remove markdown code block wrapper if present
    let cleanedText = parsedText;
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }
    
    let mapping;
    try {
      mapping = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse Groq response as JSON:", cleanedText);
      throw new Error("AI response could not be parsed. The API may be overloaded or your headers may be unclear. Please try again.");
    }
    
    const finalMapping: ColumnMapping = {
        date: null, customer: null, item: null, quantity: null, price: null, city: null, state: null, zipcode: null, revenue: null, brand: null,
        orderStatus: null, cancellationReason: null, courier: null, sku: null, articleType: null, discount: null,
        deliveredDate: null, cancelledDate: null, returnDate: null, orderId: null
    };

    for (const key in mapping) {
        const value = mapping[key];
        if (value && headers.includes(value)) {
            finalMapping[key as keyof ColumnMapping] = value;
        }
    }
    return finalMapping;
  } catch (error: any) {
    console.error("Error analyzing CSV data with Groq:", error);
    const errorMessage = error?.message || "AI analysis of the file failed.";
    throw new Error(errorMessage);
  }
}

export async function generatePptInsights(
  kpis: Kpi[],
  topItems: any[],
  topCities: any[],
  domain: string,
  month: string,
  year: number
): Promise<PptSlide[]> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Groq API key not found. Please set VITE_GROQ_API_KEY in .env.local");
  }
  const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

  const prompt = `
    You are a senior business analyst creating a presentation summary.
    The data is for the domain "${domain}" for the period of ${month}, ${year}.
    
    Here is the key data:
    - Key Performance Indicators: ${JSON.stringify(kpis)}
    - Top Selling Items by Revenue: ${JSON.stringify(topItems.map(i => i.name))}
    - Top 10 Cities by Revenue: ${JSON.stringify(topCities.map(c => c.name))}

    Generate a 4-slide presentation based on this data. Return ONLY a valid JSON array of slides. Each slide should have slideTitle and content array. Content items have type ('title', 'kpi', 'chart', 'summary'), and other fields as needed.
    Do not include any extra text.
  `;
  
  try {
    const message = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 2048,
    });
    
    const parsedText = (message.choices[0]?.message?.content || '').trim();
    console.log("Groq PPT response:", parsedText);
    
    // Remove markdown code block wrapper if present
    let cleanedText = parsedText;
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating presentation insights with Groq:", error);
    throw new Error("AI presentation generation failed.");
  }
}