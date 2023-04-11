from functools import reduce
import cloudinary.uploader

DAY = 60 * 60 * 24

def sort_multiple(sequence, *sort_order):
    """Sort a sequence by multiple criteria.

    Accepts a sequence and 0 or more (key, reverse) tuples, where
    the key is a callable used to extract the value to sort on
    from the input sequence, and reverse is a boolean dictating if
    this value is sorted in ascending or descending order.

    """
    return reduce(
        lambda s, order: sorted(s, key=order[0], reverse=order[1]),
        reversed(sort_order),
        sequence
    )

def cloudinary_upload(image_buffer, public_id, save_path):
    """
    Helper function to upload a new generated image
    to cloudinary object storage.
    """
    response: dict = cloudinary.uploader.upload(
        file = image_buffer,
        use_filename = True ,
        public_id = public_id,
        unique_filename = False,
        overwrite = True,
        folder = save_path
    )
    return response