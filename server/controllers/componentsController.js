const getSidebar = async (req, res) => {
    try {
        res.status(200).render('../components/Sidebar', { username: req.session.user.username });
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};

module.exports = {
    getSidebar,
};
