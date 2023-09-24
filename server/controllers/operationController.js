const buyOperation = async (req, res) => {
    try {
        res.status(200).json({ message: 'Buy operation successful!' });
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};

const sellOperation = async (req, res) => {
    try {
        res.status(200).json({ message: 'Sell operation successful!' });
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};

module.exports = {
    buyOperation,
    sellOperation,
};
