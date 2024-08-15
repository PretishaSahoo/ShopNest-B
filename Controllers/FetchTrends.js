

const axios = require('axios');
const cheerio = require('cheerio');
const Product = require('../Models/Product'); 
const natural = require('natural');
const API_KEY = 'AIzaSyDd6V218Yc2LG0m8uoQkPkF8TbnrItnrEM';

const stopWords = new Set([
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 
    'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 
    'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 
    'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 
    'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 
    'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 
    'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 
    'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 
    'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'
]);

const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

function cleanText(text) {
    return tokenizer.tokenize(text.toLowerCase())
        .filter(word => !stopWords.has(word))
        .map(word => stemmer.stem(word));
}

async function getVogueTrends() {
    const url = 'https://www.vogue.in/fashion';
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };
    try {
        const response = await axios.get(url, { headers });
        const $ = cheerio.load(response.data);
        const trendingKeywords = [];

        $('h2').each((i, element) => {
            const title = $(element).text();
            const keywords = cleanText(title);
            trendingKeywords.push(...keywords);
        });

        return [...new Set(trendingKeywords)];
    } catch (error) {
        console.error('Error fetching Vogue trends:', error);
        return [];
    }
}


async function getYouTubeTrends(query) {
    const baseUrl = 'https://www.googleapis.com/youtube/v3/search';
    const params = {
        part: 'snippet',
        q: query,
        key: API_KEY,
        type: 'video',
        order: 'viewCount',
        maxResults: 10
    };
    try {
        const response = await axios.get(baseUrl, { params });
        const data = response.data;
        const trendingKeywords = [];

        data.items.forEach(item => {
            const title = item.snippet.title;
            const description = item.snippet.description;
            const keywords = cleanText(title).concat(cleanText(description));
            trendingKeywords.push(...keywords);
        });

        return [...new Set(trendingKeywords)];
    } catch (error) {
        console.error('Error fetching YouTube data:', error);
        return [];
    }
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function getProductsByKeywords(keywords) {
    try {
        const regexKeywords = keywords.map(keyword => new RegExp(`\\b${escapeRegExp(keyword)}\\b`, 'i'));
        const combinedRegex = regexKeywords.map(regex => regex.source).join('|');

        const products = await Product.find({
            $or: [
                { productName: { $regex: combinedRegex, $options: 'i' } },
                { productDesc: { $regex: combinedRegex, $options: 'i' } }
            ]
        }).exec();

        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}


function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}


exports.getTrends = async (req, res) => {
    const query = req.params.query; 
    try {
        const vogueTrends = await getVogueTrends();
        const youtubeTrends = await getYouTubeTrends(query);
        const allTrends = [...new Set([...vogueTrends, ...youtubeTrends])];

        let products = await getProductsByKeywords(allTrends);
        products = shuffleArray(products);

        const ans = [products[0],products[1],products[2] , products[4]];

        res.status(200).json({
            vogueTrends,
            youtubeTrends,
            products:ans
        });
    } catch (error) {
        console.error('Error getting trends:', error);
        res.status(500).json({ error: 'Failed to get trends' });
    }
};


