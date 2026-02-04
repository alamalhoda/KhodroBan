import os

def clean_files_in_directory(directory):
    for filename in os.listdir(directory):
        if filename.endswith(".vue"):
            filepath = os.path.join(directory, filename)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # This part is crucial. We open in 'w' mode with utf-8-sig
                # which will write a BOM. Then we'll remove it.
                # A simpler open('w', encoding='utf-8') might also work,
                # but this is more explicit to handle potential BOMs.
                with open(filepath, 'w', encoding='utf-8-sig') as f:
                    f.write(content)

                # Now, let's ensure there is no BOM.
                with open(filepath, 'rb') as f:
                    content_bytes = f.read()
                
                if content_bytes.startswith(b'\xef\xbb\xbf'):
                    content_bytes = content_bytes[3:]
                    with open(filepath, 'wb') as f:
                        f.write(content_bytes)
                
                print(f"Cleaned {filename}")

            except Exception as e:
                print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    views_directory = 'src/views'
    clean_files_in_directory(views_directory)
