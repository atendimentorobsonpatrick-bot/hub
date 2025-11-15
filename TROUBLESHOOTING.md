# AURA Application Troubleshooting Guide

This guide provides solutions to common configuration and runtime issues.

---

### 🚨 Issue: Payment Fails with "Payment Gateway Error"

**Symptom:** When you try to complete a purchase on the checkout page, you see an error message that says:

> **Payment Gateway Error: Your merchant account is not configured for API transactions. Please contact Frendz.com.br support to enable API payments for your acquirer.**

**Cause:** This is not a bug in the AURA application code. This is a common security and configuration setting on your Frendz.com.br merchant account. It means that your account is not yet authorized to accept payments through an API, which is how our application communicates with it.

**Solution:** You must enable API payments in your Frendz.com.br dashboard.

1.  **Log in** to your merchant account at [Frendz.com.br](https://frendz.com.br/).
2.  Navigate to your **account settings** or **payment gateway configuration**. Look for a section related to **"API Access"**, **"Transaction Settings"**, or **"Acquirer Configuration"** (Configuração do Adquirente).
3.  Ensure that your payment acquirer (the company that processes your credit cards, like Cielo, Rede, etc.) is **enabled for API transactions**. There may be a checkbox or a toggle switch for this.
4.  **Save** your changes.

**If you cannot find this setting:**

This is very common. Some providers require you to contact them directly to enable this feature.

*   **Contact Frendz.com.br support.**
*   Tell them: *"I need to enable my account to process payments via your public API. My current acquirer (adquirente) seems to be disabled for API use. Can you please enable it?"*

Once this setting is enabled on your Frendz account, the error will be resolved, and payments will work correctly. No code changes are needed.
