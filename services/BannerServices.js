const bannerModel = require("../models/BannerModels");
const aqp = require('api-query-params');

const createBannerService = async (bannerData) => {
    try {
        let result = await bannerModel.create(bannerData);
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const getAllBannerService = async (limit, page, name, queryString) => {
    try {
        let result = null;
        let filter = {};

        if (queryString) {
            const { filter: parsedFilter } = aqp(queryString);
            delete parsedFilter.page;

            Object.keys(parsedFilter).forEach(key => {
                if (typeof parsedFilter[key] === "string") {
                    parsedFilter[key] = { $regex: parsedFilter[key], $options: "i" };
                }
            });

            filter = { ...parsedFilter };
        }

        if (limit && page) {
            let offset = (page - 1) * limit;

            result = await bannerModel
                .find(filter)
                .sort({ createdAt: -1 }) // Sắp xếp từ mới -> cũ
                .skip(offset)
                .limit(limit)
                .exec();
        } else {
            result = await bannerModel.find(filter).sort({ createdAt: -1 });
        }

        const total = await bannerModel.countDocuments(filter);
        return { result, total };

    } catch (error) {
        console.log("error >>>> ", error);
        return null;
    }
};

module.exports = {
    createBannerService, getAllBannerService
}