'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Eye, Edit, Check, X, Send, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    body: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

interface EmailLog {
    id: string;
    to: string;
    subject: string;
    templateName: string | null;
    status: string;
    error: string | null;
    createdAt: string;
}

interface EmailStats {
    total: number;
    sent: number;
    failed: number;
}

const templateLabels: Record<string, { label: string; description: string; icon: string }> = {
    order_confirmation: {
        label: 'Conferma Ordine',
        description: 'Inviata automaticamente quando un cliente completa un ordine',
        icon: '🛒'
    },
    shipping_notification: {
        label: 'Notifica Spedizione',
        description: 'Inviata quando l\'ordine viene spedito con tracking',
        icon: '🚚'
    },
    newsletter_welcome: {
        label: 'Benvenuto Newsletter',
        description: 'Inviata quando qualcuno si iscrive alla newsletter',
        icon: '✉️'
    },
    order_delivered: {
        label: 'Ordine Consegnato',
        description: 'Inviata quando l\'ordine risulta consegnato',
        icon: '✅'
    }
};

export default function EmailAdmin() {
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [logs, setLogs] = useState<EmailLog[]>([]);
    const [stats, setStats] = useState<EmailStats>({ total: 0, sent: 0, failed: 0 });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'templates' | 'logs'>('templates');
    const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
    const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
    const [editForm, setEditForm] = useState({ subject: '', body: '', active: true });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [templatesRes, logsRes] = await Promise.all([
                fetch('/api/admin/email-templates'),
                fetch('/api/admin/email-logs')
            ]);

            const templatesData = await templatesRes.json();
            const logsData = await logsRes.json();

            if (Array.isArray(templatesData)) {
                setTemplates(templatesData);
            }
            if (logsData.logs) {
                setLogs(logsData.logs);
                setStats(logsData.stats);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (template: EmailTemplate) => {
        setEditingTemplate(template);
        setEditForm({
            subject: template.subject,
            body: template.body,
            active: template.active
        });
    };

    const handleSave = async () => {
        if (!editingTemplate) return;
        setSaving(true);

        try {
            const res = await fetch(`/api/admin/email-templates/${editingTemplate.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });

            if (res.ok) {
                await fetchData();
                setEditingTemplate(null);
            }
        } catch (error) {
            console.error('Error saving template:', error);
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/admin"
                        className="p-2 hover:bg-gray-200 rounded-lg transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Mail className="w-7 h-7 text-purple-600" />
                            Gestione Email
                        </h1>
                        <p className="text-gray-600">Template email e storico invii</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Send className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email Totali</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Inviate</p>
                                <p className="text-2xl font-bold text-green-600">{stats.sent}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Fallite</p>
                                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('templates')}
                        className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${activeTab === 'templates' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <FileText className="w-4 h-4" />
                        Template
                    </button>
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${activeTab === 'logs' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <Send className="w-4 h-4" />
                        Storico Invii
                    </button>
                </div>

                {/* Templates Tab */}
                {activeTab === 'templates' && (
                    <div className="space-y-4">
                        {templates.map((template) => {
                            const info = templateLabels[template.name] || {
                                label: template.name,
                                description: '',
                                icon: '📧'
                            };

                            return (
                                <div
                                    key={template.id}
                                    className="bg-white rounded-xl p-6 shadow-sm"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="text-3xl">{info.icon}</div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-gray-900">{info.label}</h3>
                                                    {template.active ? (
                                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                                            Attivo
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                                                            Disattivo
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">{info.description}</p>
                                                <p className="text-xs text-gray-400 mt-2">
                                                    Oggetto: <span className="text-gray-600">{template.subject}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 ml-12 sm:ml-0">
                                            <button
                                                onClick={() => setPreviewTemplate(template)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Anteprima"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(template)}
                                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                                                title="Modifica"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                            <h3 className="font-semibold text-blue-800 mb-2">📝 Placeholder Disponibili</h3>
                            <p className="text-sm text-blue-700 mb-3">
                                Puoi usare questi placeholder nei template, verranno sostituiti automaticamente:
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                                <code className="bg-white px-2 py-1 rounded text-blue-600">{'{{customerName}}'}</code>
                                <code className="bg-white px-2 py-1 rounded text-blue-600">{'{{orderNumber}}'}</code>
                                <code className="bg-white px-2 py-1 rounded text-blue-600">{'{{totalAmount}}'}</code>
                                <code className="bg-white px-2 py-1 rounded text-blue-600">{'{{trackingNumber}}'}</code>
                                <code className="bg-white px-2 py-1 rounded text-blue-600">{'{{shippingAddress}}'}</code>
                                <code className="bg-white px-2 py-1 rounded text-blue-600">{'{{siteName}}'}</code>
                            </div>
                        </div>
                    </div>
                )}

                {/* Logs Tab */}
                {activeTab === 'logs' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {logs.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                <Send className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <p>Nessuna email inviata ancora</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="text-left p-4 text-sm font-medium text-gray-500">Data</th>
                                            <th className="text-left p-4 text-sm font-medium text-gray-500">Destinatario</th>
                                            <th className="text-left p-4 text-sm font-medium text-gray-500">Oggetto</th>
                                            <th className="text-left p-4 text-sm font-medium text-gray-500">Tipo</th>
                                            <th className="text-left p-4 text-sm font-medium text-gray-500">Stato</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {logs.map((log) => (
                                            <tr key={log.id} className="hover:bg-gray-50">
                                                <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                                                    {formatDate(log.createdAt)}
                                                </td>
                                                <td className="p-4 text-sm text-gray-900">
                                                    {log.to}
                                                </td>
                                                <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                                                    {log.subject}
                                                </td>
                                                <td className="p-4 text-sm text-gray-500">
                                                    {log.templateName ? templateLabels[log.templateName]?.label || log.templateName : '-'}
                                                </td>
                                                <td className="p-4">
                                                    {log.status === 'sent' ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                                            <CheckCircle className="w-3 h-3" />
                                                            Inviata
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full" title={log.error || ''}>
                                                            <AlertCircle className="w-3 h-3" />
                                                            Fallita
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Edit Modal */}
                {editingTemplate && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b sticky top-0 bg-white">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold">
                                        Modifica Template: {templateLabels[editingTemplate.name]?.label || editingTemplate.name}
                                    </h2>
                                    <button
                                        onClick={() => setEditingTemplate(null)}
                                        className="p-2 hover:bg-gray-100 rounded-lg"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Oggetto Email
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.subject}
                                        onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Corpo Email (HTML)
                                    </label>
                                    <textarea
                                        value={editForm.body}
                                        onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                                        rows={20}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="active"
                                        checked={editForm.active}
                                        onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })}
                                        className="w-4 h-4 text-purple-600 rounded"
                                    />
                                    <label htmlFor="active" className="text-sm text-gray-700">
                                        Template attivo
                                    </label>
                                </div>
                            </div>

                            <div className="p-6 border-t flex gap-3 justify-end sticky bottom-0 bg-white">
                                <button
                                    onClick={() => setEditingTemplate(null)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Annulla
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Salvataggio...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Salva Modifiche
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Preview Modal */}
                {previewTemplate && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                            <div className="p-4 border-b flex items-center justify-between">
                                <div>
                                    <h2 className="font-bold">Anteprima Email</h2>
                                    <p className="text-sm text-gray-500">{previewTemplate.subject}</p>
                                </div>
                                <button
                                    onClick={() => setPreviewTemplate(null)}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-auto">
                                <iframe
                                    srcDoc={previewTemplate.body
                                        .replace(/\{\{customerName\}\}/g, 'Mario Rossi')
                                        .replace(/\{\{orderNumber\}\}/g, 'ORD-ABC123')
                                        .replace(/\{\{totalAmount\}\}/g, '€49.90')
                                        .replace(/\{\{trackingNumber\}\}/g, 'BRT123456789')
                                        .replace(/\{\{shippingAddress\}\}/g, 'Via Roma 123\n00100 Roma (RM)')
                                        .replace(/\{\{siteName\}\}/g, 'Il Desiderio di una Stella')
                                        .replace(/\{\{siteUrl\}\}/g, 'http://localhost:3000')
                                        .replace(/\{\{trackingUrl\}\}/g, '#')
                                        .replace(/\{\{unsubscribeUrl\}\}/g, '#')
                                    }
                                    className="w-full h-[600px] border-0"
                                    title="Anteprima Email"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
