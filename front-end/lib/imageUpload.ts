export interface ImageUploadResult {
    url: string;
    width?: number;
    height?: number;
}

export const uploadImage = async (file: File): Promise<ImageUploadResult> => {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
            reject(new Error('File must be an image'));
            return;
        }

        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
            reject(new Error('Image must be smaller than 5MB'));
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                resolve({
                    url: e.target?.result as string,
                    width: img.width,
                    height: img.height,
                });
            };
            img.onerror = () => reject(new Error('Invalid image file'));
            img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
};

export const resizeImage = (
    file: File,
    maxWidth: number = 800,
    maxHeight: number = 600,
    quality: number = 0.8,
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // Calculate new dimensions
            let { width, height } = img;

            if (width > height) {
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            // Draw and compress
            ctx?.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(dataUrl);
        };

        img.onerror = () => reject(new Error('Failed to load image'));

        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    });
};
