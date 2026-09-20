import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOrg, useDepartments, useLocations } from "@/api/hooks";
import api from "@/api/client";
import { useQuery } from "@tanstack/react-query";
import { Building2, MapPin, Briefcase, Pencil, X, Plus, Trash2, Save, Mail, Bot, Sparkles, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import ChangePasswordCard from "@/components/ChangePasswordCard";
import ApiKeysCard from "@/components/ApiKeysCard";

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
  "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
  "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
  "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso",
  "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic",
  "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia",
  "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica",
  "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea",
  "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia",
  "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
  "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India",
  "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon",
  "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
  "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro",
  "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands",
  "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia",
  "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea",
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia",
  "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
  "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia",
  "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
  "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan",
  "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania",
  "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
  "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
  "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela",
  "Vietnam", "Yemen", "Zambia", "Zimbabwe",
];

const NAME_ONLY_RE = /^[A-Za-z\s\-'.]+$/;

const TIMEZONES = [
  "UTC",
  "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "America/Toronto", "America/Vancouver", "America/Sao_Paulo", "America/Mexico_City",
  "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Madrid", "Europe/Rome",
  "Europe/Amsterdam", "Europe/Stockholm", "Europe/Warsaw", "Europe/Zurich",
  "Europe/Dublin", "Europe/Moscow",
  "Asia/Kolkata", "Asia/Dubai", "Asia/Singapore", "Asia/Tokyo", "Asia/Seoul",
  "Asia/Shanghai", "Asia/Hong_Kong", "Asia/Bangkok", "Asia/Jakarta", "Asia/Manila",
  "Asia/Kuala_Lumpur", "Asia/Ho_Chi_Minh", "Asia/Riyadh",
  "Australia/Sydney", "Australia/Melbourne", "Pacific/Auckland",
  "Africa/Lagos", "Africa/Nairobi", "Africa/Cairo", "Africa/Johannesburg",
];

export default function SettingsPage() {
  const { t } = useTranslation();
  const { data: org, isLoading } = useOrg();
  const { data: departments } = useDepartments();
  const { data: locations } = useLocations();
  const [editingOrg, setEditingOrg] = useState(false);

  if (isLoading) return <div className="text-muted-foreground">{t("settingsPage.loading")}</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{t("settingsPage.header.title")}</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">{t("settingsPage.header.subtitle")}</p>
      </div>

      {/* Organization info */}
      {editingOrg ? (
        <OrgEditForm org={org} onClose={() => setEditingOrg(false)} />
      ) : (
        <div className="bg-card rounded-lg border border-border p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              <h2 className="font-semibold text-foreground">{t("settingsPage.company.title")}</h2>
            </div>
            <button
              onClick={() => setEditingOrg(true)}
              className="flex items-center gap-1.5 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 font-medium"
            >
              <Pencil className="h-3.5 w-3.5" /> {t("settingsPage.actions.edit")}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              ["fields.name", org?.name],
              ["fields.legalName", org?.legal_name],
              ["fields.email", org?.email],
              ["fields.phone", org?.contact_number],
              ["fields.country", org?.country],
              ["fields.state", org?.state],
              ["fields.city", org?.city],
              ["fields.timezone", org?.timezone],
              ["fields.language", org?.language],
            ].map(([labelKey, value]) => (
              <div key={labelKey as string}>
                <p className="text-xs text-muted-foreground">{t(`settingsPage.${labelKey}`)}</p>
                <p className="text-sm font-medium text-foreground">{value || "\u2014"}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Departments */}
        <DepartmentsCard departments={departments || []} />

        {/* Locations */}
        <LocationsCard locations={locations || []} />
      </div>

      {/* Programmatic access — org-admin-generated API keys that work across
          EmpCloud and the Payroll module. */}
      <ApiKeysCard />

      {/* Multi-Tenant SMTP Server & AI Chatbot API Key Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <SmtpSettingsCard />
        <AiSettingsCard />
      </div>

      {/* Account security — same self-service password change card the
          /change-password route uses, embedded here so HR can change
          their password without leaving the settings flow. */}
      <div className="mt-6">
        <ChangePasswordCard />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Organization Edit Form
// ---------------------------------------------------------------------------

function OrgEditForm({ org, onClose }: { org: any; onClose: () => void }) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: org?.name || "",
    legal_name: org?.legal_name || "",
    email: org?.email || "",
    contact_number: org?.contact_number || "",
    country: org?.country || "",
    state: org?.state || "",
    city: org?.city || "",
    timezone: org?.timezone || "",
    language: org?.language || "",
  });

  const updateOrg = useMutation({
    mutationFn: (data: typeof form) =>
      api.put("/organizations/me", data).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["org"] });
      onClose();
    },
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = t("settingsPage.validation.email");
    }
    if (form.city && !NAME_ONLY_RE.test(form.city)) {
      errors.city = t("settingsPage.validation.city");
    }
    if (form.state && !NAME_ONLY_RE.test(form.state)) {
      errors.state = t("settingsPage.validation.state");
    }
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});
    updateOrg.mutate(form);
  };

  const fields: [string, keyof typeof form][] = [
    ["fields.name", "name"],
    ["fields.legalName", "legal_name"],
    ["fields.email", "email"],
    ["fields.phone", "contact_number"],
    ["fields.country", "country"],
    ["fields.state", "state"],
    ["fields.city", "city"],
    ["fields.timezone", "timezone"],
    ["fields.language", "language"],
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Building2 className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          <h2 className="font-semibold text-foreground">{t("settingsPage.company.editTitle")}</h2>
        </div>
        <button type="button" onClick={onClose} className="text-muted-foreground hover:text-muted-foreground">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {fields.map(([labelKey, key]) => (
          <div key={key}>
            <label className="block text-xs text-muted-foreground mb-1">{t(`settingsPage.${labelKey}`)}</label>
            {key === "timezone" ? (
              <select
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md text-sm bg-card"
              >
                <option value="">{t("settingsPage.form.selectTimezone")}</option>
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            ) : key === "country" ? (
              <select
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md text-sm bg-card"
              >
                <option value="">{t("settingsPage.form.selectCountry")}</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            ) : (
              <>
                <input
                  type={key === "email" ? "email" : "text"}
                  value={form[key]}
                  onChange={(e) => {
                    setForm({ ...form, [key]: e.target.value });
                    if (validationErrors[key]) {
                      setValidationErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-md text-[13px] ${validationErrors[key] ? "border-red-400" : "border-border"}`}
                />
                {validationErrors[key] && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors[key]}</p>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm text-muted-foreground border border-border rounded-md hover:bg-muted"
        >
          {t("settingsPage.actions.cancel")}
        </button>
        <button
          type="submit"
          disabled={updateOrg.isPending}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-md text-[13px] font-medium hover:bg-brand-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {t("settingsPage.actions.saveChanges")}
        </button>
      </div>
      {updateOrg.isError && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">{t("settingsPage.errors.updateOrg")}</p>
      )}
    </form>
  );
}

// ---------------------------------------------------------------------------
// Departments Card with Add/Delete
// ---------------------------------------------------------------------------

function DepartmentsCard({ departments }: { departments: any[] }) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [newName, setNewName] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [addError, setAddError] = useState("");
  // editId = the department row currently in edit mode (null if none)
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editError, setEditError] = useState("");

  const addDept = useMutation({
    mutationFn: (name: string) =>
      api.post("/organizations/me/departments", { name }).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["departments"] });
      setNewName("");
      setShowAdd(false);
      setAddError("");
    },
    onError: (err: any) => {
      setAddError(err?.response?.data?.error?.message || t("settingsPage.errors.addDepartment"));
    },
  });

  const updateDept = useMutation({
    mutationFn: (vars: { id: number; name: string }) =>
      api
        .put(`/organizations/me/departments/${vars.id}`, { name: vars.name })
        .then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["departments"] });
      setEditId(null);
      setEditName("");
      setEditError("");
    },
    onError: (err: any) => {
      setEditError(err?.response?.data?.error?.message || t("settingsPage.errors.renameDepartment"));
    },
  });

  const [deleteError, setDeleteError] = useState("");

  const deleteDept = useMutation({
    mutationFn: (id: number) =>
      api.delete(`/organizations/me/departments/${id}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["departments"] });
      setDeleteError("");
    },
    onError: (err: any) => {
      setDeleteError(err?.response?.data?.error?.message || t("settingsPage.errors.deleteDepartment"));
    },
  });

  const startEdit = (d: any) => {
    setEditId(d.id);
    setEditName(d.name);
    setEditError("");
  };
  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditError("");
  };
  const saveEdit = () => {
    if (editId == null) return;
    const name = editName.trim();
    if (!name) return;
    updateDept.mutate({ id: editId, name });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Briefcase className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          <h2 className="font-semibold text-foreground">{t("settingsPage.departments.title", { count: departments.length })}</h2>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 font-medium"
        >
          <Plus className="h-3.5 w-3.5" /> {t("settingsPage.actions.add")}
        </button>
      </div>
      {showAdd && (
        <div className="mb-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setAddError("");
              if (newName.trim()) addDept.mutate(newName.trim());
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={newName}
              onChange={(e) => { setNewName(e.target.value); setAddError(""); }}
              placeholder={t("settingsPage.departments.namePlaceholder")}
              className="bg-card text-foreground flex-1 px-3 py-2 border border-border rounded-md text-sm"
              required
            />
            <button
              type="submit"
              disabled={addDept.isPending}
              className="px-3 py-2 bg-brand-600 text-white rounded-md text-[13px] font-medium hover:bg-brand-700 disabled:opacity-50"
            >
              {t("settingsPage.actions.add")}
            </button>
          </form>
          {addError && <p className="text-xs text-red-500 mt-1">{addError}</p>}
        </div>
      )}
      <ul className="space-y-2">
        {departments.map((d: any) => (
          <li
            key={d.id}
            className="flex items-center justify-between px-3 py-2 bg-muted rounded-md text-[13px]"
          >
            {editId === d.id ? (
              <form
                className="flex-1 flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  saveEdit();
                }}
              >
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => {
                    setEditName(e.target.value);
                    setEditError("");
                  }}
                  autoFocus
                  className="bg-card text-foreground flex-1 px-2 py-1 border border-border rounded text-sm"
                  required
                />
                <button
                  type="submit"
                  disabled={updateDept.isPending || !editName.trim()}
                  className="text-green-600 dark:text-green-400 hover:text-green-700 disabled:opacity-50"
                  title={t("settingsPage.rowActions.save")}
                >
                  <Save className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="text-muted-foreground hover:text-muted-foreground"
                  title={t("settingsPage.rowActions.cancel")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </form>
            ) : (
              <>
                <span>{d.name}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(d)}
                    className="text-muted-foreground hover:text-brand-600"
                    title={t("settingsPage.departments.renameTitle")}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteError("");
                      deleteDept.mutate(d.id);
                    }}
                    className="text-muted-foreground hover:text-red-500"
                    title={t("settingsPage.departments.deleteTitle")}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      {editError && <p className="text-xs text-red-500 mt-2">{editError}</p>}
      {deleteError && <p className="text-xs text-red-500 mt-2">{deleteError}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Locations Card with Add
// ---------------------------------------------------------------------------

function LocationsCard({ locations }: { locations: any[] }) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [locForm, setLocForm] = useState({ name: "", timezone: "" });
  const [addError, setAddError] = useState("");
  // Inline edit state — editId is the row currently open for edit (null = none)
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", timezone: "" });
  const [editError, setEditError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const addLoc = useMutation({
    mutationFn: (data: { name: string; timezone: string }) =>
      api.post("/organizations/me/locations", data).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["locations"] });
      setLocForm({ name: "", timezone: "" });
      setShowAdd(false);
      setAddError("");
    },
    onError: (err: any) => {
      setAddError(err?.response?.data?.error?.message || t("settingsPage.errors.addLocation"));
    },
  });

  const updateLoc = useMutation({
    mutationFn: (vars: { id: number; name: string; timezone?: string }) =>
      api
        .put(`/organizations/me/locations/${vars.id}`, {
          name: vars.name,
          timezone: vars.timezone || undefined,
        })
        .then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["locations"] });
      setEditId(null);
      setEditForm({ name: "", timezone: "" });
      setEditError("");
    },
    onError: (err: any) => {
      setEditError(err?.response?.data?.error?.message || t("settingsPage.errors.updateLocation"));
    },
  });

  const deleteLoc = useMutation({
    mutationFn: (id: number) =>
      api.delete(`/organizations/me/locations/${id}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["locations"] });
      setDeleteError("");
    },
    onError: (err: any) => {
      setDeleteError(err?.response?.data?.error?.message || t("settingsPage.errors.deleteLocation"));
    },
  });

  const startEdit = (l: any) => {
    setEditId(l.id);
    setEditForm({ name: l.name || "", timezone: l.timezone || "" });
    setEditError("");
  };
  const cancelEdit = () => {
    setEditId(null);
    setEditForm({ name: "", timezone: "" });
    setEditError("");
  };
  const saveEdit = () => {
    if (editId == null) return;
    const name = editForm.name.trim();
    if (!name) return;
    updateLoc.mutate({ id: editId, name, timezone: editForm.timezone.trim() });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          <h2 className="font-semibold text-foreground">{t("settingsPage.locations.title", { count: locations.length })}</h2>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 font-medium"
        >
          <Plus className="h-3.5 w-3.5" /> {t("settingsPage.actions.add")}
        </button>
      </div>
      {showAdd && (
        <div className="mb-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setAddError("");
            const name = locForm.name.trim();
            const timezone = locForm.timezone.trim();
            if (!name) return;
            if (!timezone) {
              setAddError(t("settingsPage.validation.timezoneRequired"));
              return;
            }
            addLoc.mutate({ name, timezone });
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={locForm.name}
            onChange={(e) => { setLocForm({ ...locForm, name: e.target.value }); setAddError(""); }}
            placeholder={t("settingsPage.locations.namePlaceholder")}
            className="bg-card text-foreground flex-1 px-3 py-2 border border-border rounded-md text-sm"
            required
          />
          <select
            value={locForm.timezone}
            onChange={(e) => { setLocForm({ ...locForm, timezone: e.target.value }); setAddError(""); }}
            className="flex-1 px-3 py-2 border border-border rounded-md text-sm bg-card"
            required
            aria-required="true"
          >
            <option value="">{t("settingsPage.form.selectTimezoneRequired")}</option>
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={addLoc.isPending}
            className="px-3 py-2 bg-brand-600 text-white rounded-md text-[13px] font-medium hover:bg-brand-700 disabled:opacity-50"
          >
            {t("settingsPage.actions.add")}
          </button>
        </form>
        {addError && <p className="text-xs text-red-500 mt-1">{addError}</p>}
        </div>
      )}
      <ul className="space-y-2">
        {locations.map((l: any) => (
          <li
            key={l.id}
            className="flex items-center justify-between px-3 py-2 bg-muted rounded-md text-[13px]"
          >
            {editId === l.id ? (
              <form
                className="flex-1 flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  saveEdit();
                }}
              >
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => {
                    setEditForm({ ...editForm, name: e.target.value });
                    setEditError("");
                  }}
                  autoFocus
                  placeholder={t("settingsPage.locations.namePlaceholder")}
                  className="bg-card text-foreground flex-1 px-2 py-1 border border-border rounded text-sm"
                  required
                />
                <select
                  value={editForm.timezone}
                  onChange={(e) => setEditForm({ ...editForm, timezone: e.target.value })}
                  className="flex-1 px-2 py-1 border border-border rounded text-sm bg-card"
                >
                  <option value="">{t("settingsPage.form.noTimezone")}</option>
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={updateLoc.isPending || !editForm.name.trim()}
                  className="text-green-600 dark:text-green-400 hover:text-green-700 disabled:opacity-50"
                  title={t("settingsPage.rowActions.save")}
                >
                  <Save className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="text-muted-foreground hover:text-muted-foreground"
                  title={t("settingsPage.rowActions.cancel")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </form>
            ) : (
              <>
                <span>{l.name}</span>
                <div className="flex items-center gap-2">
                  {l.timezone && <span className="text-xs text-muted-foreground">{l.timezone}</span>}
                  <button
                    onClick={() => startEdit(l)}
                    className="text-muted-foreground hover:text-brand-600"
                    title={t("settingsPage.locations.editTitle")}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteError("");
                      deleteLoc.mutate(l.id);
                    }}
                    className="text-muted-foreground hover:text-red-500"
                    title={t("settingsPage.locations.deleteTitle")}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      {editError && <p className="text-xs text-red-500 mt-2">{editError}</p>}
      {deleteError && <p className="text-xs text-red-500 mt-2">{deleteError}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Per-tenant SMTP Settings Card
// ---------------------------------------------------------------------------

function SmtpSettingsCard() {
  const qc = useQueryClient();
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const { data: smtp, isLoading } = useQuery({
    queryKey: ["org-smtp"],
    queryFn: () => api.get("/organizations/me/smtp").then((r) => r.data.data),
  });

  const [form, setForm] = useState({
    smtp_host: "",
    smtp_port: 587,
    smtp_user: "",
    smtp_pass: "",
    smtp_from_email: "",
    smtp_from_name: "",
    smtp_secure: false,
  });

  // Sync loaded settings into local form state
  const [initialized, setInitialized] = useState(false);
  if (smtp && !initialized) {
    setForm({
      smtp_host: smtp.smtp_host || "",
      smtp_port: smtp.smtp_port || 587,
      smtp_user: smtp.smtp_user || "",
      smtp_pass: smtp.smtp_pass || "",
      smtp_from_email: smtp.smtp_from_email || "",
      smtp_from_name: smtp.smtp_from_name || "",
      smtp_secure: !!smtp.smtp_secure,
    });
    setInitialized(true);
  }

  const updateMutation = useMutation({
    mutationFn: (data: typeof form) => api.put("/organizations/me/smtp", data).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["org-smtp"] });
      setTestResult({ success: true, message: "SMTP configuration saved successfully." });
    },
    onError: (err: any) => {
      setTestResult({ success: false, message: err?.response?.data?.error?.message || "Failed to save SMTP settings" });
    },
  });

  const testMutation = useMutation({
    mutationFn: () => api.post("/organizations/me/test-smtp", { recipient_email: form.smtp_from_email }).then((r) => r.data.data),
    onSuccess: (data) => {
      setTestResult({ success: true, message: data?.message || "SMTP test succeeded!" });
    },
    onError: (err: any) => {
      setTestResult({ success: false, message: err?.response?.data?.error?.message || "SMTP test failed" });
    },
  });

  if (isLoading) return <div className="bg-card rounded-lg border border-border p-4 animate-pulse h-64" />;

  return (
    <div className="bg-card rounded-lg border border-border p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">SMTP Server Settings</h3>
            <p className="text-xs text-muted-foreground">Configure custom organization email server</p>
          </div>
        </div>
        {smtp?.smtp_host && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            <CheckCircle2 className="h-3 w-3" /> Configured
          </span>
        )}
      </div>

      {testResult && (
        <div className={`p-3 rounded-md text-xs flex items-start gap-2 ${testResult.success ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200 border border-emerald-200" : "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200 border border-rose-200"}`}>
          {testResult.success ? <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" /> : <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />}
          <span>{testResult.message}</span>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); updateMutation.mutate(form); }} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">SMTP Host</label>
            <input
              type="text"
              placeholder="smtp.gmail.com"
              value={form.smtp_host}
              onChange={(e) => setForm({ ...form, smtp_host: e.target.value })}
              className="w-full px-3 py-1.5 border border-border rounded-md text-xs bg-background"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Port</label>
            <input
              type="number"
              value={form.smtp_port}
              onChange={(e) => setForm({ ...form, smtp_port: Number(e.target.value) || 587 })}
              className="w-full px-3 py-1.5 border border-border rounded-md text-xs bg-background"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Username / Email</label>
            <input
              type="text"
              placeholder="hr@company.com"
              value={form.smtp_user}
              onChange={(e) => setForm({ ...form, smtp_user: e.target.value })}
              className="w-full px-3 py-1.5 border border-border rounded-md text-xs bg-background"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Password / App Key</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.smtp_pass}
              onChange={(e) => setForm({ ...form, smtp_pass: e.target.value })}
              className="w-full px-3 py-1.5 border border-border rounded-md text-xs bg-background"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">From Address</label>
            <input
              type="email"
              placeholder="noreply@company.com"
              value={form.smtp_from_email}
              onChange={(e) => setForm({ ...form, smtp_from_email: e.target.value })}
              className="w-full px-3 py-1.5 border border-border rounded-md text-xs bg-background"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Sender Name</label>
            <input
              type="text"
              placeholder="Acme HR Team"
              value={form.smtp_from_name}
              onChange={(e) => setForm({ ...form, smtp_from_name: e.target.value })}
              className="w-full px-3 py-1.5 border border-border rounded-md text-xs bg-background"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="smtp_secure"
            checked={form.smtp_secure}
            onChange={(e) => setForm({ ...form, smtp_secure: e.target.checked })}
            className="rounded border-border"
          />
          <label htmlFor="smtp_secure" className="text-xs text-muted-foreground cursor-pointer">
            Use Secure SSL/TLS (port 465)
          </label>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => testMutation.mutate()}
            disabled={testMutation.isPending || !form.smtp_host}
            className="px-3 py-1.5 rounded-md text-xs font-medium border border-border hover:bg-muted disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            {testMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Test SMTP Connection
          </button>

          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-4 py-1.5 rounded-md text-xs font-medium bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            {updateMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Save SMTP Settings
          </button>
        </div>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Per-tenant AI Chatbot API Key Settings Card
// ---------------------------------------------------------------------------

function AiSettingsCard() {
  const qc = useQueryClient();
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const { data: ai, isLoading } = useQuery({
    queryKey: ["org-ai"],
    queryFn: () => api.get("/organizations/me/ai").then((r) => r.data.data),
  });

  const [form, setForm] = useState({
    ai_provider: "gemini",
    ai_api_key: "",
    ai_model: "gemini-1.5-flash",
    ai_system_prompt: "",
    ai_enabled: true,
  });

  const [initialized, setInitialized] = useState(false);
  if (ai && !initialized) {
    setForm({
      ai_provider: ai.ai_provider || "gemini",
      ai_api_key: ai.ai_api_key || "",
      ai_model: ai.ai_model || "gemini-1.5-flash",
      ai_system_prompt: ai.ai_system_prompt || "",
      ai_enabled: ai.ai_enabled !== false,
    });
    setInitialized(true);
  }

  const updateMutation = useMutation({
    mutationFn: (data: typeof form) => api.put("/organizations/me/ai", data).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["org-ai"] });
      setTestResult({ success: true, message: "AI Chatbot API settings saved successfully." });
    },
    onError: (err: any) => {
      setTestResult({ success: false, message: err?.response?.data?.error?.message || "Failed to save AI settings" });
    },
  });

  const testMutation = useMutation({
    mutationFn: () => api.post("/organizations/me/test-ai").then((r) => r.data.data),
    onSuccess: (data) => {
      setTestResult({ success: true, message: data?.message || "AI API Key test succeeded!" });
    },
    onError: (err: any) => {
      setTestResult({ success: false, message: err?.response?.data?.error?.message || "AI API test failed" });
    },
  });

  if (isLoading) return <div className="bg-card rounded-lg border border-border p-4 animate-pulse h-64" />;

  return (
    <div className="bg-card rounded-lg border border-border p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">AI Chatbot API Key</h3>
            <p className="text-xs text-muted-foreground">Configure organization AI key & model</p>
          </div>
        </div>
        {ai?.has_api_key && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
            <Sparkles className="h-3 w-3" /> API Key Set
          </span>
        )}
      </div>

      {testResult && (
        <div className={`p-3 rounded-md text-xs flex items-start gap-2 ${testResult.success ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200 border border-emerald-200" : "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200 border border-rose-200"}`}>
          {testResult.success ? <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" /> : <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />}
          <span>{testResult.message}</span>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); updateMutation.mutate(form); }} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">AI Provider</label>
            <select
              value={form.ai_provider}
              onChange={(e) => setForm({ ...form, ai_provider: e.target.value })}
              className="w-full px-3 py-1.5 border border-border rounded-md text-xs bg-background"
            >
              <option value="gemini">Google Gemini</option>
              <option value="openai">OpenAI (ChatGPT)</option>
              <option value="anthropic">Anthropic (Claude)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Model</label>
            <input
              type="text"
              placeholder="gemini-1.5-flash / gpt-4o"
              value={form.ai_model}
              onChange={(e) => setForm({ ...form, ai_model: e.target.value })}
              className="w-full px-3 py-1.5 border border-border rounded-md text-xs bg-background"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">API Key</label>
          <input
            type="password"
            placeholder="AIzaSy... / sk-..."
            value={form.ai_api_key}
            onChange={(e) => setForm({ ...form, ai_api_key: e.target.value })}
            className="w-full px-3 py-1.5 border border-border rounded-md text-xs bg-background"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Custom System Prompt (Optional)</label>
          <textarea
            rows={2}
            placeholder="You are an AI HR assistant for Acme Corp..."
            value={form.ai_system_prompt}
            onChange={(e) => setForm({ ...form, ai_system_prompt: e.target.value })}
            className="w-full px-3 py-1.5 border border-border rounded-md text-xs bg-background resize-none"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="ai_enabled"
            checked={form.ai_enabled}
            onChange={(e) => setForm({ ...form, ai_enabled: e.target.checked })}
            className="rounded border-border"
          />
          <label htmlFor="ai_enabled" className="text-xs text-muted-foreground cursor-pointer">
            Enable AI Chatbot Widget for Employees
          </label>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => testMutation.mutate()}
            disabled={testMutation.isPending}
            className="px-3 py-1.5 rounded-md text-xs font-medium border border-border hover:bg-muted disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            {testMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Test AI Connection
          </button>

          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-4 py-1.5 rounded-md text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            {updateMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Save AI Settings
          </button>
        </div>
      </form>
    </div>
  );
}

