"""
Small Flask server to accept image uploads for the project.
Run:
  pip install flask
  python3 upload_server.py

It will serve on http://0.0.0.0:5000 and save files to assets/uploads/
"""
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import os

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), 'assets', 'uploads')
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXT = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed(filename):
    ext = filename.rsplit('.', 1)[-1].lower()
    return ext in ALLOWED_EXT

app = Flask(__name__, static_folder='.')

@app.route('/upload', methods=['POST'])
def upload():
    if 'images' not in request.files:
        return jsonify({'error': 'no file field images'}), 400
    files = request.files.getlist('images')
    saved = []
    for f in files:
        if f and allowed(f.filename):
            fname = secure_filename(f.filename)
            path = os.path.join(UPLOAD_DIR, fname)
            f.save(path)
            saved.append(fname)
    return jsonify({'saved': saved}), 200

@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_DIR, filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
