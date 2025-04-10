const {
    createBannerService, getAllBannerService, putUpdateBannerService,
    deleteABannerService
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

const putUpdateBanner = async (req, res) => {
    const { id } = req.params;
    const { name, image, status } = req.body;

    try {
        const result = await putUpdateBannerService(id, name, image, status);

        if (!result) {
            return res.status(404).json({
                statusCode: 404,
                message: "Không tìm thấy Banner với ID"
            });
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Cập nhật Banner thành công!",
            data: result
        });
    } catch (error) {
        console.log("Controller error:", error);
        return res.status(500).json({
            statusCode: 500,
            message: error.message || "Lỗi máy chủ, không thể cập nhật banner"
        });
    }
};

const deleteBanner = async (req, res) => {
    let { id } = req.params;

    try {
        let result = await deleteABannerService(id);

        if (!result) {
            return res.status(404).json({
                statusCode: 404,
                message: `Không tìm thấy banner với id ${id} để xóa.`,
                data: null
            });
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Xóa banner thành công!",
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            statusCode: 400,
            message: error.message,
            error: "Bad Request"
        });
    }
};



module.exports = {
    postCreateBanner, getBannerAPI, putUpdateBanner,
    deleteBanner
}