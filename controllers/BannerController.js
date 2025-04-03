const {
    createBannerService, getAllBannerService
} = require('../services/BannerServices')


const postCreateBanner = async (req, res) => {
    let { name, image, status } = req.body;

    if (!name || !image) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });
    }

    let bannerData = {
        name,
        image,
        status: status ?? true
    };

    let result = await createBannerService(bannerData);

    if (!result) {
        return res.status(500).json({
            statusCode: 500,
            message: 'Thêm banner thất bại!'
        });
    }

    return res.status(201).json({
        statusCode: 201,
        message: 'Thêm banner thành công!',
        data: result
    });
};

const getBannerAPI = async (req, res) => {
    let { limit, page, name } = req.query;
    limit = limit ? Number(limit) : null;
    page = page ? Number(page) : null;

    let result, total;

    if (limit && page) {
        ({ result, total } = await getAllBannerService(limit, page, name, req.query));
        return res.status(200).json({
            statusCode: 200,
            message: "Fetch Banner",
            data: {
                meta: {
                    page: page,
                    limit: limit,
                    pages: Math.ceil(total / limit),
                    total: total
                },
                result: result
            }
        });
    } else {
        ({ result } = await getAllBannerService());
        return res.status(200).json({
            statusCode: 200,
            message: "Fetch Banner",
            data: result
        });
    }
};

module.exports = {
    postCreateBanner, getBannerAPI
}