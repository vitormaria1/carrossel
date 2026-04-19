#!/usr/bin/env python3
"""
Web Application - Carousel Copy Generator
Interface web visual para gerar carrosséis
"""

from flask import Flask, render_template, request, jsonify
import os
from dotenv import load_dotenv
from carousel_copy_generator import analyze_and_generate_carousel, refine_carousel

# Carregar .env
load_dotenv()

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

# Armazenar carrossel atual em sessão
current_carousel = {}

@app.route('/')
def index():
    """Página inicial"""
    return render_template('index.html')

@app.route('/api/generate', methods=['POST'])
def generate():
    """Gera um carrossel"""
    try:
        data = request.json

        topic = data.get('topic', '').strip()
        audience = data.get('audience', '').strip()
        tone = data.get('tone', '') or None
        carousel_type = data.get('type', '') or None
        context = data.get('context', '') or None

        if not topic or not audience:
            return jsonify({'error': 'Tópico e público são obrigatórios'}), 400

        print(f"Gerando carrossel: {topic}")

        carousel = analyze_and_generate_carousel(
            topic=topic,
            target_audience=audience,
            user_tone=tone,
            preferred_type=carousel_type,
            additional_context=context
        )

        current_carousel['original'] = carousel

        return jsonify({
            'success': True,
            'carousel': carousel
        })

    except Exception as e:
        print(f"Erro: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/refine', methods=['POST'])
def refine():
    """Refina um carrossel"""
    try:
        data = request.json
        feedback = data.get('feedback', '').strip()

        if not feedback:
            return jsonify({'error': 'Feedback é obrigatório'}), 400

        if 'original' not in current_carousel:
            return jsonify({'error': 'Nenhum carrossel gerado ainda'}), 400

        print(f"Refinando: {feedback}")

        refined = refine_carousel(
            current_carousel['original'],
            feedback
        )

        current_carousel['original'] = refined

        return jsonify({
            'success': True,
            'carousel': refined
        })

    except Exception as e:
        print(f"Erro no refinamento: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/download', methods=['POST'])
def download():
    """Baixa o carrossel como markdown"""
    try:
        data = request.json
        filename = data.get('filename', 'carrossel').replace(' ', '_')

        if 'original' not in current_carousel:
            return jsonify({'error': 'Nenhum carrossel para baixar'}), 400

        content = current_carousel['original']

        return jsonify({
            'success': True,
            'filename': f"{filename}.md",
            'content': content
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print()
    print("=" * 70)
    print("🎡 CAROUSEL COPY GENERATOR - WEB APP")
    print("=" * 70)
    print()
    print("🌐 Abrindo em: http://localhost:8000")
    print()
    print("Pressione Ctrl+C para parar")
    print()
    print("=" * 70)
    print()

    app.run(debug=True, port=8000, host='127.0.0.1')
