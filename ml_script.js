const ML_SCRIPT = {
    "KMEANS": {
        "START": () => `Welcome to K-Means Clustering! We have a cloud of data points and we want to group them into clusters based on their similarity. Let's find the hidden patterns!`,
        "INIT_CENTROIDS": (k) => `First, we'll place ${k} random centroids in the field. These will act as the "hearts" of our future clusters.`,
        "ASSIGN": () => `Assignment phase! Every data point is looking for the centroid closest to it. Each point will join the team of its nearest neighbor.`,
        "UPDATE": () => `Update phase! The centroids are moving. They're shifting to the exact center of all their team members to better represent the group.`,
        "CONVERGED": () => `Look at that! The centroids have stopped moving. Our data is now perfectly clustered. Pattern discovered!`,
        "STUCK_OR_MAX": () => `We've reached a stable state or the maximum iterations. The clusters are now as balanced as they can be.`
    },
    "NEURAL": {
        "START": () => `Welcome to the world of Neural Networks! We're building a simple brain to solve a problem. Let's watch how it learns through experience.`,
        "FORWARD": () => `Forward pass! Information flows from the input layer through the hidden neurons. Each connection has a "weight" that determines its importance.`,
        "ACTIVATION": (val) => `The neurons are firing! They use an activation function to decide how much signal to pass forward. Current prediction: ${val.toFixed(3)}.`,
        "LOSS": (error) => `Calculating the error. We're off by ${error.toFixed(4)}. This "Loss" tells the network exactly how much it needs to improve.`,
        "BACKWARD": () => `Backpropagation! We're sending the error signal backwards through the network to update the weights. This is where the learning happens!`,
        "SUCCESS": (loss) => `Training complete! The network has optimized its weights and minimized the loss to ${loss.toFixed(4)}. It's now ready to predict!`
    }
};