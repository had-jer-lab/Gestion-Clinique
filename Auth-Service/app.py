import os
from flask import Flask, render_template, request, flash, session, redirect, url_for, jsonify
import sqlite3
import requests
from config import *
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'clinique2025')

# CORS Configuration - More secure for production
CORS(app, resources={
    r"/*": {
        "origins": ["*"],  # In production, specify exact origins
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
}) 

DB_PATH = os.path.join("instance", "base.db")

# Use config.py for service URLs
CLINIQUE_API_URL = f"{DOCTORS_URL}/api/doctors"
 
def get_db():
    if not os.path.exists("instance"):
        os.mkdir("instance")
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# ===================== Health Check =====================
@app.route('/health')
def health_check():
    """Health check endpoint for Docker"""
    try:
        conn = get_db()
        conn.close()
        return jsonify({"status": "healthy", "service": "auth-service"}), 200
    except Exception as e:
        return jsonify({"status": "unhealthy", "error": str(e)}), 500

# ===================== الصفحات الأساسية =====================
@app.route('/')
@app.route('/accueil')
def accueil():
    """صفحة الاستقبال الرئيسية الموحدة"""
    return render_template('accueil.html')

# تحديث route الصفحة القديمة لتوجيهها إلى الصفحة الموحدة
@app.route('/home')
def home_redirect():
    """توجيه إلى الصفحة الرئيسية الموحدة"""
    return redirect(url_for('accueil'))

# إضافة routes للوصول السريع إلى الخدمات الأخرى
@app.route('/goto/doctors')
def goto_doctors():
    """توجيه إلى خدمة الأطباء"""
    return redirect('http://localhost:3000')

@app.route('/goto/patients')
def goto_patients():
    """توجيه إلى خدمة المرضى"""
    return redirect('http://localhost:3001')

@app.route('/goto/rdv')
def goto_rdv():
    """توجيه إلى خدمة المواعيد"""
    return redirect('http://localhost:3002')
 
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        try:
            form_type = request.form.get('form_type')
            email = request.form['email'].strip()
            password = request.form['password']
     
            conn = get_db()
            c = conn.cursor()
     
            if form_type == 'login':
                # Check users table (Directeur/Secrétaire)
                c.execute("SELECT * FROM users WHERE email=? AND password=?", (email, password))
                user = c.fetchone()
                if user:
                    session['user'] = dict(user)
                    conn.close()
                    flash("Connecté avec succès !", "success")
                    if user['role'] == "Directeur":
                        return redirect(url_for('directeur_dashboard'))
                    else:
                        return redirect(url_for('secretaire_dashboard'))
     
                # Check medecins table
                c.execute("SELECT * FROM medecins WHERE email=? AND password=?", (email, password))
                med = c.fetchone()
                conn.close()
                if med:
                    session['user'] = dict(med)
                    session['user']['role'] = "Docteur"
                    flash(f"Bienvenue Dr. {med['prenom']} !", "success")
                    # Redirect to doctors service using external port
                    return redirect('http://localhost:3000')
     
                flash("Identifiants invalides.", "error")
                return redirect(url_for('login'))
     
            elif form_type == 'signup':
                # Check if email exists
                c.execute("SELECT * FROM users WHERE email=?", (email,))
                exists1 = c.fetchone()
                c.execute("SELECT * FROM medecins WHERE email=?", (email,))
                exists2 = c.fetchone()
                if exists1 or exists2:
                    conn.close()
                    flash("Cet email est déjà utilisé.", "error")
                    return redirect(url_for('login'))
     
                # Prepare API payload for doctors service
                api_payload = {
                    "name": request.form['nom'] + ' ' + request.form['prenom'],
                    "speciality": request.form['specialite'],
                    "status": "Disponible",
                    "patients": 0
                }
                
                try:
                    # Call doctors service API using internal URL
                    response = requests.post(
                        CLINIQUE_API_URL, 
                        json=api_payload, 
                        timeout=5,
                        proxies={'http': None, 'https': None}
                    )
                    response.raise_for_status()
                    
                    # Insert into local database
                    c.execute("""
                        INSERT INTO medecins (nom, prenom, telephone, email, specialite, password)
                        VALUES (?, ?, ?, ?, ?, ?)
                    """, (
                        request.form['nom'], 
                        request.form['prenom'], 
                        request.form['telephone'],
                        request.form['email'], 
                        request.form['specialite'], 
                        request.form['password']
                    ))
                    conn.commit()
                    flash("Compte médecin créé avec succès !", "success")
                except requests.exceptions.RequestException as e:
                    print(f"Error calling doctors service: {e}")
                    flash(f"Erreur lors de la création du compte: {str(e)}", "error")
                finally:
                    conn.close()
                
                return redirect(url_for('login'))
        
        except Exception as e:
            print(f"Login error: {e}")
            import traceback
            traceback.print_exc()
            flash("Une erreur s'est produite lors de la connexion", "error")
            return redirect(url_for('login'))
 
    return render_template('index.html')
 
@app.route('/secretaire/dashboard')
def secretaire_dashboard():
    if not session.get('user') or session.get('user', {}).get('role') != "Secrétaire":
        flash("Accès non autorisé", "error")
        return redirect(url_for('login'))
    return render_template('secretaire_dashboard.html', user=session['user'])
 
@app.route('/directeur/dashboard')
def directeur_dashboard():
    if not session.get('user') or session.get('user', {}).get('role') != "Directeur":
        flash("Accès non autorisé", "error")
        return redirect(url_for('login'))
    return render_template('directeur_dashboard.html', user=session['user'])
 
@app.route('/logout')
def logout():
    session.clear()
    flash("Déconnexion réussie.", "info")
    return redirect(url_for('login'))
 
# ===================== API Endpoints =====================
@app.route('/api/admins')
def api_admins():
    """Get all admin users (Directeur/Secrétaire)"""
    try:
        conn = get_db()
        c = conn.cursor()
        c.execute("""
            SELECT id, nom, prenom, email, password, role 
            FROM users 
            WHERE role IN ('Directeur', 'Secrétaire')
        """)
        rows = c.fetchall()
        conn.close()
        
        result = []
        for r in rows:
            name = f"{r['nom'] or ''} {r['prenom'] or ''}".strip() or "Non défini"
            result.append({
                "id": r['id'], 
                "nom": name, 
                "email": r['email'], 
                "password": r['password'], 
                "role": r['role']
            })
        return jsonify(result)
    except Exception as e:
        print(f"Error in api_admins: {e}")
        return jsonify({"error": str(e)}), 500
 
@app.route('/api/admins/add', methods=['POST'])
def add_admin():
    try:
        data = request.get_json()
        if not data: 
            return jsonify({"error": "No data provided"}), 400
        
        conn = get_db()
        c = conn.cursor()
        try:
            c.execute("""
                INSERT INTO users (nom, prenom, email, password, role) 
                VALUES (?, ?, ?, ?, ?)
            """, (data['nom'], "", data['email'], data['password'], data['role']))
            conn.commit()
            return jsonify({"success": True})
        except Exception as e:
            return jsonify({"error": str(e)}), 400
        finally:
            conn.close()
    except Exception as e:
        print(f"Error in add_admin: {e}")
        return jsonify({"error": str(e)}), 500
 
@app.route('/api/admins/update', methods=['POST'])
def update_admin():
    try:
        data = request.get_json()
        if not data or 'id' not in data: 
            return jsonify({"error": "Invalid data"}), 400
        
        conn = get_db()
        c = conn.cursor()
        try:
            c.execute("""
                UPDATE users 
                SET nom=?, email=?, password=?, role=? 
                WHERE id=?
            """, (data['nom'], data['email'], data['password'], data['role'], data['id']))
            conn.commit()
            return jsonify({"success": True})
        except Exception as e:
            return jsonify({"error": str(e)}), 400
        finally:
            conn.close()
    except Exception as e:
        print(f"Error in update_admin: {e}")
        return jsonify({"error": str(e)}), 500
 
@app.route('/api/admins/delete/<int:user_id>', methods=['DELETE'])
def delete_admin(user_id):
    try:
        conn = get_db()
        c = conn.cursor()
        try:
            c.execute("DELETE FROM users WHERE id=?", (user_id,))
            conn.commit()
            return jsonify({"success": True})
        except Exception as e:
            return jsonify({"error": str(e)}), 400
        finally:
            conn.close()
    except Exception as e:
        print(f"Error in delete_admin: {e}")
        return jsonify({"error": str(e)}), 500
 
@app.route('/api/doctors-count')
def doctors_count():
    """Get count of registered doctors"""
    try:
        conn = get_db()
        c = conn.cursor()
        c.execute("SELECT COUNT(*) FROM medecins")
        count = c.fetchone()[0]
        conn.close()
        return jsonify({"count": count})
    except Exception as e:
        print(f"Error in doctors_count: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.get_json()
        if not data or 'email' not in data or 'new_password' not in data:
            return jsonify({"success": False, "error": "Données invalides"}), 400
     
        email = data['email']
        new_password = data['new_password']
     
        conn = get_db()
        c = conn.cursor()
        try:
            # Try users table first
            c.execute("UPDATE users SET password=? WHERE email=?", (new_password, email))
            if c.rowcount == 0:
                # Try medecins table
                c.execute("UPDATE medecins SET password=? WHERE email=?", (new_password, email))
                if c.rowcount == 0:
                    return jsonify({"success": False, "error": "Email non trouvé"}), 404
            conn.commit()
            return jsonify({"success": True})
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500
        finally:
            conn.close()
    except Exception as e:
        print(f"Error in reset_password: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

# ===================== RDV API Proxy =====================
@app.route('/api/rdv/stats')
def rdv_stats():
    """Proxy pour les statistiques RDV"""
    try:
        response = requests.get(f"{RDV_URL}/api/stats", timeout=5)
        response.raise_for_status()
        return jsonify(response.json())
    except Exception as e:
        print(f"Error fetching RDV stats: {e}")
        return jsonify({
            "total_factures": 0,
            "revenu_total": 0,
            "annee_courante": 2025,
            "revenus_mensuels": [0] * 12
        })

@app.route('/api/rdv/stats/historique')
def rdv_stats_historique():
    """Proxy pour l'historique des revenus"""
    try:
        response = requests.get(f"{RDV_URL}/api/stats/historique", timeout=5)
        response.raise_for_status()
        return jsonify(response.json())
    except Exception as e:
        print(f"Error fetching RDV historique: {e}")
        return jsonify([])

# ===================== Error Handlers =====================
@app.errorhandler(404)
def not_found(e):
    if request.path.startswith('/api/'):
        return jsonify({"error": "Endpoint not found"}), 404
    return render_template('accueil.html'), 404

@app.errorhandler(500)
def server_error(e):
    print(f"Internal server error: {e}")
    import traceback
    traceback.print_exc()
    if request.path.startswith('/api/'):
        return jsonify({"error": "Internal server error"}), 500
    flash("Une erreur s'est produite", "error")
    return redirect(url_for('accueil'))

# ===================== RDV API Proxy (إضافي) =====================
@app.route('/api/rdv/rdv_today')
def rdv_today():
    """Proxy pour les rendez-vous du jour"""
    try:
        response = requests.get(f"{RDV_URL}/api/rdv_today", timeout=5)
        response.raise_for_status()
        return jsonify(response.json())
    except Exception as e:
        print(f"⚠️ Error fetching RDV today: {e}")
        return jsonify([])

if __name__ == '__main__':
    host = os.getenv('FLASK_HOST', '0.0.0.0')
    port = int(os.getenv('FLASK_PORT', 5009))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    print(f"🚀 Starting Auth Service on {host}:{port}")
    print(f"🔗 Doctors Service URL: {DOCTORS_URL}")
    print(f"🔗 Patients Service URL: {PATIENTS_URL}")
    print(f"🔗 RDV Service URL: {RDV_URL}")
    
    app.run(host=host, port=port, debug=debug)