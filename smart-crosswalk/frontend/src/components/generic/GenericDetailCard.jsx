import { Card, CardContent, Button } from '../ui';

export function GenericDetailCard({
  header,
  image,
  fields = [],
  actions = [],
  onClick,
  className = ''
}) {
  return (
    <Card
      className={`hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Header */}
      {header && (
        <div className="px-4 py-3 border-b border-surface-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {header.icon && <span className="text-xl">{header.icon}</span>}
            {header.title && <h3 className="font-semibold text-surface-900">{header.title}</h3>}
          </div>
          {header.subtitle && (
            <span className="text-sm text-surface-500">{header.subtitle}</span>
          )}
        </div>
      )}

      {/* Content */}
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Image */}
          {image && (
            <div className="flex-shrink-0">
              {image.url ? (
                <img
                  src={image.url}
                  alt={image.alt || 'Detail image'}
                  className="w-32 h-32 rounded-lg object-cover border border-surface-200"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect fill="%23f3f4f6" width="128" height="128"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="32"%3E📷%3C/text%3E%3C/svg%3E';
                  }}
                />
              ) : (
                <div className="w-32 h-32 rounded-lg bg-surface-100 border border-surface-200 flex flex-col items-center justify-center">
                  <span className="text-4xl text-surface-400">{image.fallbackIcon || '📷'}</span>
                  <span className="text-xs text-surface-500 mt-1">No Image</span>
                </div>
              )}
            </div>
          )}

          {/* Fields */}
          {fields.length > 0 && (
            <div className="flex-1 space-y-2">
              {fields.map((field, index) => (
                <div key={index} className="flex items-start gap-2">
                  {field.label && (
                    <span className="text-sm font-medium text-surface-600">{field.label}:</span>
                  )}
                  {field.component ? (
                    field.component
                  ) : (
                    <span className={`text-sm ${field.valueClassName || 'text-surface-900'} ${field.break ? 'break-all' : ''}`}>
                      {field.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="mt-4 flex gap-2" onClick={(e) => onClick && e.stopPropagation()}>
            {actions.map((action, index) => {
              if (action.href) {
                // Use <a> for links — Button doesn't support href natively
                return (
                  <a
                    key={index}
                    href={action.href}
                    target={action.target}
                    rel={action.rel}
                    className={`btn btn-${action.variant || 'primary'}`}
                  >
                    {action.label}
                  </a>
                );
              }

              return (
                <Button
                  key={index}
                  variant={action.variant || 'primary'}
                  onClick={action.onClick}
                  disabled={action.disabled}
                >
                  {action.label}
                </Button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
