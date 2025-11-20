// Utility function to safely format dates
export const formatDate = (dateString) => {
    if (!dateString) return '-';

    try {
        const date = new Date(dateString);

        // Check if date is valid
        if (isNaN(date.getTime())) {
            return '-';
        }

        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Date formatting error:', error);
        return '-';
    }
};

export const formatDateTime = (dateString) => {
    if (!dateString) return '-';

    try {
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return '-';
        }

        return date.toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('DateTime formatting error:', error);
        return '-';
    }
};

export const formatTime = (dateString) => {
    if (!dateString) return '-';

    try {
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return '-';
        }

        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Time formatting error:', error);
        return '-';
    }
};
