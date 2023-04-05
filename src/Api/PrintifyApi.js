import axios from "axios";

const proxy = "https://fullbridge.wz.cz/NFTIRL/proxy.php";
const proxyOrder = "https://fullbridge.wz.cz/NFTIRL/proxyPost.php";
const baseUrl = "https://api.printify.com/v1/";
const baseToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzN2Q0YmQzMDM1ZmUxMWU5YTgwM2FiN2VlYjNjY2M5NyIsImp0aSI6IjAyNzZjODk5MWQzZWQyM2JmZGVjODhjMGU3NjU1YmEyZmM5OTlkY2U3NGVmMDAwZTMxYzNkZTMwZTIxNGNlNGI5NmEyN2RlNTg3YmQ5ODBlIiwiaWF0IjoxNjcyNDk2ODI2Ljg2Nzc1MiwibmJmIjoxNjcyNDk2ODI2Ljg2Nzc1NSwiZXhwIjoxNzA0MDMyODI2LjgzNDQyNywic3ViIjoiMTExMzkyOTciLCJzY29wZXMiOlsic2hvcHMubWFuYWdlIiwic2hvcHMucmVhZCIsImNhdGFsb2cucmVhZCIsIm9yZGVycy5yZWFkIiwicHJvZHVjdHMucmVhZCIsInByb2R1Y3RzLndyaXRlIiwid2ViaG9va3MucmVhZCIsIndlYmhvb2tzLndyaXRlIiwidXBsb2Fkcy5yZWFkIiwidXBsb2Fkcy53cml0ZSIsInByaW50X3Byb3ZpZGVycy5yZWFkIl19.AiejNaWnqhsM0gAgMLFyCjK0lCnr1tXcenBS_dXzYTxR5f90wmaFyOidn-sK0mJeTLUzXu6zBCdaswqw2fU";
const baseOrderToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzN2Q0YmQzMDM1ZmUxMWU5YTgwM2FiN2VlYjNjY2M5NyIsImp0aSI6IjQ5MzAzMGE4NjI4OTNkMjYxOTg4N2Y4ZmQyNDBjNDUwOGE1ZjdlNjQyMThkZDA4Y2E5MmY4MTI5NTdkOTQ2ZDUxOGQxMTIxMGJiMDIwNzM1IiwiaWF0IjoxNjc3OTY2MjM3LjUxNzcxNCwibmJmIjoxNjc3OTY2MjM3LjUxNzcxOCwiZXhwIjoxNzA5NTg4NjM3LjUxMTk1Mywic3ViIjoiMTExMzkyOTciLCJzY29wZXMiOlsib3JkZXJzLndyaXRlIl19.At-yh8bQuutRQ5RfJeLk2ze7FukjZGMAr4vZM7BedezaHLdKn-qOqldJSszYsTlmZh6knRuwBbdL7vonXmQ";

export const getShopsAsync = async () => {
    return await axios.get(proxy + "?method=GET&cors=" + baseUrl + "shops.json", getHeaders());
}
export const getBlueprintsAsync = async () => {
    return await axios.get(proxy + "?method=GET&cors=" + baseUrl + "catalog/blueprints.json", getHeaders());
}
export const getPrintProvidersAsync = async (blueprintId) => {
    return await axios.get(proxy + "?method=GET&cors=" + baseUrl + "catalog/blueprints/" + blueprintId + "/print_providers.json", getHeaders());
}
export const getVariantsAsync = async (blueprintId, printProviderId) => {
    return await axios.get(proxy + "?method=GET&cors=" + baseUrl + "catalog/blueprints/" + blueprintId + "/print_providers/" + printProviderId + "/variants.json", getHeaders());
}
export const getShippingAsync = async (blueprintId, printProviderId) => {
    return await axios.get(proxy + "?method=GET&cors=" + baseUrl + "catalog/blueprints/" + blueprintId + "/print_providers/" + printProviderId + "/shipping.json", getHeaders());
}
export const saveProductAsync = async (shopId, title, description, blueprintId, printProviderId, variants, printAreas) => {
    return await axios.post(proxy, {
        cors: baseUrl + "shops/" + shopId + "/products.json",
        method: "POST",
        title: title,
        description: description,
        blueprint_id: blueprintId,
        print_provider_id: printProviderId,
        variants: variants,
        print_areas: printAreas
    }, getHeaders());
}
export const uploadImageAsync = async (fileName, url) => {
    return await axios.post(proxy, {
        cors: baseUrl + "uploads/images.json",
        method: "POST",
        file_name: fileName,
        url: url
    }, getHeaders());
}
export const getImagesAsync = async () => {
    return await axios.get(proxy + "?method=GET&cors=" + baseUrl + "uploads.json", getHeaders());
}
/*export const deleteProduct = async (shopId, productId) => { // Doesn't work because of the DELETE method
    return await axios.delete(proxy + "?method=DELETE&cors=" + baseUrl + "shops/" + shopId + "/products/" + productId + ".json", getHeaders());
}*/

const getHeaders = () => {
    return { 
        headers: { 
            Authorization: "Bearer " + baseToken,
            //"User-Agent": "NFT-IRL",
            "Content-Type": "application/json"
        },
        //mode: "no-cors",
        //method: "GET"
    };
}
const getHeadersOrder = () => {
    return {
        headers: {
            Authorization: "Bearer " + baseOrderToken,
            "Content-Type": "application/json"
        }
    }
}
export const getVariant = (id, price) => {
    return { id: id, price: price, is_enabled: true };
}
export const getPrintArea = (variantIds, imageId, x, y, scale, angle = 0) => {
    return { 
        variant_ids: variantIds,
        placeholders: [{
            position: "front",
            images: [{id: imageId, x: x, y: y, scale: scale, angle: angle}]
        }]
    };
}

export const createLineItem = (blueprintId, variantId, printProviderId, src, x, y, scale, angle = 0, quantity = 1) => {
    return {
        blueprint_id: blueprintId,
        variant_id: variantId,
        print_provider_id: printProviderId,
        quantity: quantity,
        print_areas: {
            front: [
                { src: src, scale: scale, x: x, y: y, angle: angle }
            ]
        }
    };
}
export const createOrderAsync = async (shopId, externalId, label, lineItems, shippingMethod, 
    firstName, lastName, email, phone, country, region, address1, address2,
    city, zip) => {
    return await axios.post(proxyOrder, {
        cors: baseUrl + "shops/" + shopId + "/orders.json",
        method: "POST",
        external_id: externalId,
        label: label,
        line_items: lineItems,
        shipping_method: shippingMethod,
        send_shipping_notification: true,
        address_to: {
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone,
            country: country,
            region: region,
            address1: address1,
            address2: address2,
            city: city,
            zip: zip
        }
    }, getHeadersOrder());
}
export const calculateShipping = async (shopId, lineItems, firstName, lastName, 
    email, phone, country, region, address1, address2, city, zip) => {
    return await axios.post(proxy, {
        cors: baseUrl + "shops/" + shopId + "/orders/shipping.json",
        method: "POST",
        line_items: lineItems,
        address_to: {
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone,
            country: country,
            region: region,
            address1: address1,
            address2: address2,
            city: city,
            zip: zip
        }
    }, getHeaders());
}
