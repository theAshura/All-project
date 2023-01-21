import { CommonApiParam } from 'models/common.model';

export const handleFilterParams = (params?: CommonApiParam) => {
  const {
    sort,
    vesselId,
    pageSize,
    vesselTypeId,
    startDate,
    isMapping,
    viqVesselType,
    vettingRiskScore,
    page,
    isLeftMenu,
    scope,
    eventTypeId,
    workSpace,
    role,
    content,
    status,
    country,
    portType,
    groupId,
    isRefreshLoading,
    actualAuditFrom,
    actualAuditTo,
    fromDate,
    toDate,
    createdAtFrom,
    createdAtTo,
    approverType,
    auditEntity,
    type,
    handleSuccess,
    hasElement,
    hasSelf,
    filterRisk,
    companyId,
    vesselScreeningId,
    vesselTypeName,
  } = params ?? {};
  let newParams: CommonApiParam = { page: 1, pageSize: 20 };
  if (page) {
    newParams = { ...newParams, page };
  }

  if (pageSize) {
    newParams = { ...newParams, pageSize };
  }
  if (handleSuccess) {
    newParams = { ...newParams, handleSuccess };
  }
  if (content?.trim()) {
    newParams = { ...newParams, content: content?.trim() };
  }
  if (companyId && companyId !== 'all') {
    newParams = { ...newParams, companyId };
  }
  if (auditEntity && auditEntity !== 'all') {
    newParams = { ...newParams, auditEntity };
  }
  if (status && status !== 'all') {
    newParams = { ...newParams, status };
  }
  if (eventTypeId) {
    newParams = { ...newParams, eventTypeId };
  }
  if (approverType && approverType !== 'all') {
    newParams = { ...newParams, approverType };
  }
  if (vettingRiskScore && vettingRiskScore !== 'all') {
    newParams = {
      ...newParams,
      vettingRiskScore,
    };
  }
  if (viqVesselType && viqVesselType !== 'all') {
    newParams = {
      ...newParams,
      viqVesselType,
    };
  }

  if (filterRisk) {
    newParams = {
      ...newParams,
      filterRisk,
    };
  }
  if (vesselTypeId && vesselTypeId !== 'all') {
    newParams = {
      ...newParams,
      vesselTypeId,
    };
  }
  if (groupId && groupId !== 'all') {
    newParams = { ...newParams, groupId };
  }
  if (country && country.value !== 'all') {
    newParams = { ...newParams, country };
  }
  if (portType && portType !== 'all') {
    newParams = { ...newParams, portType };
  }
  if (scope && scope !== 'all') {
    newParams = { ...newParams, scope };
  }
  if (sort) {
    newParams = { ...newParams, sort };
  }
  if (role && role !== 'all') {
    newParams = { ...newParams, role };
  }
  if (isRefreshLoading !== undefined) {
    newParams = { ...newParams, isRefreshLoading };
  }
  if (actualAuditFrom) {
    newParams = { ...newParams, actualAuditFrom };
  }
  if (actualAuditTo) {
    newParams = { ...newParams, actualAuditTo };
  }
  if (fromDate) {
    newParams = { ...newParams, fromDate };
  }
  if (toDate) {
    newParams = { ...newParams, toDate };
  }
  if (createdAtFrom) {
    newParams = { ...newParams, createdAtFrom };
  }
  if (createdAtTo) {
    newParams = { ...newParams, createdAtTo };
  }

  if (typeof isMapping === 'boolean') {
    newParams = { ...newParams, isMapping };
  }
  if (typeof workSpace === 'boolean') {
    newParams = { ...newParams, workSpace };
  }
  if (isLeftMenu !== undefined) {
    newParams = { ...newParams, isLeftMenu };
  }
  if (startDate) {
    newParams = { ...newParams, startDate };
  }
  if (type) {
    newParams = { ...newParams, type };
  }
  if (hasElement) {
    newParams = { ...newParams, hasElement };
  }
  if (hasSelf) {
    newParams = { ...newParams, hasSelf };
  }
  if (filterRisk) {
    newParams = { ...newParams, filterRisk };
  }
  if (vesselScreeningId) {
    newParams = { ...newParams, vesselScreeningId };
  }
  if (vesselId) {
    newParams = { ...newParams, vesselId };
  }
  if (vesselTypeName) {
    newParams = { ...newParams, vesselTypeName };
  }
  return newParams;
};
