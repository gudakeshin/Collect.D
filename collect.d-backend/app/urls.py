from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CustomerViewSet, InvoiceViewSet, PaymentViewSet,
    CollectionViewSet, ReportViewSet,
    CustomerDataView,
    InvoiceDataView,
    PaymentDataView,
    CollectionCasesView,
    DisputesView,
    RiskScoresView,
    CustomerInteractionsView,
    OrdersView,
    GLEntriesView,
    InvoiceLineItemsView,
    PaymentPlansView,
    DSOAnalyticsView,
    StrategyEffectivenessView,
    CollectionPerformanceView,
)

router = DefaultRouter()
router.register(r'customers', CustomerViewSet, basename='customers')
router.register(r'invoices', InvoiceViewSet, basename='invoices')
router.register(r'payments', PaymentViewSet, basename='payments')
router.register(r'collections', CollectionViewSet, basename='collections')
router.register(r'reports', ReportViewSet, basename='reports')

urlpatterns = [
    path('', include(router.urls)),
    path('data/customers/', CustomerDataView.as_view(), name='customer-data'),
    path('data/invoices/', InvoiceDataView.as_view(), name='invoice-data'),
    path('data/payments/', PaymentDataView.as_view(), name='payment-data'),
    path('data/collection-cases/', CollectionCasesView.as_view(), name='collection-cases'),
    path('data/disputes/', DisputesView.as_view(), name='disputes'),
    path('data/risk-scores/', RiskScoresView.as_view(), name='risk-scores'),
    path('data/customer-interactions/', CustomerInteractionsView.as_view(), name='customer-interactions'),
    path('data/orders/', OrdersView.as_view(), name='orders'),
    path('data/gl-entries/', GLEntriesView.as_view(), name='gl-entries'),
    path('data/invoice-line-items/', InvoiceLineItemsView.as_view(), name='invoice-line-items'),
    path('data/payment-plans/', PaymentPlansView.as_view(), name='payment-plans'),
    path('data/dso-analytics/', DSOAnalyticsView.as_view(), name='dso-analytics'),
    path('data/strategy-effectiveness/', StrategyEffectivenessView.as_view(), name='strategy-effectiveness'),
    path('data/collection-performance/', CollectionPerformanceView.as_view(), name='collection-performance'),
] 