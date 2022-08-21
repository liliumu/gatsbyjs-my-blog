import re
from datetime import datetime
from pathlib import Path
import argparse

"""
[Example]
> python scripts/create-new-post.py --title "My Awesome Article."
content/blog/my-awesome-article-/index.md
"""

# input args (--title)
parser = argparse.ArgumentParser(
    description='Create new post.')
parser.add_argument('--title', type=str, required=True)
args = parser.parse_args()

if args.title:
    title = args.title
else:
    title = "My Default Title"

# now()
now = datetime.now()

# create templete
content = f"""---
title: {title}
date: "{now.isoformat()[:23] + 'Z'}"
---
"""

# determine save file dir / path
norm_title = re.sub(r'[^\w]', '-', title).lower()
save_dir = Path('content') / 'blog' / norm_title
save_dir.mkdir(parents=True, exist_ok=False)
save_path = save_dir / 'index.md'

# create post file
with open(save_path, 'w') as f:
    f.write(content)

# print post file
print(save_path)
