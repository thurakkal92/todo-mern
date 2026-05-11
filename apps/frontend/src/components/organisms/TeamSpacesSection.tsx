"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import { Icon } from "@/components/atoms/Icon";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import {
  useGetTeamsQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "@/store/workspaceApi";
import { setActiveProject, clearActiveProject } from "@/store/workspaceSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/cn";
import { IconButton } from "../atoms/IconButton";
import { Input } from "../atoms/Input";

// ─── Team color cycling ───────────────────────────────────────────────────────

// ─── Inline input ─────────────────────────────────────────────────────────────

interface InlineInputProps {
  placeholder: string;
  initialValue?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

function InlineInput({
  placeholder,
  initialValue = "",
  onConfirm,
  onCancel,
  isLoading = false,
}: InlineInputProps) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const trimmed = value.trim();
      if (trimmed) onConfirm(trimmed);
    } else if (e.key === "Escape") {
      onCancel();
    }
  }

  function handleBlur() {
    const trimmed = value.trim();
    if (trimmed) onConfirm(trimmed);
    else onCancel();
  }

  return (
    <Input
      inputSize="sm"
      ref={inputRef}
      type="text"
      value={value}
      placeholder={placeholder}
      disabled={isLoading}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      className="text-body-sm text-on-surface placeholder:text-on-surface-variant/50 bg-surface-container ring-outline-variant focus:ring-secondary w-full rounded px-2 py-1 outline-none ring-1"
    />
  );
}

// ─── Nav item actions (3-dot dropdown via portal) ─────────────────────────────

interface NavItemActionsProps {
  label: string;
  onRename: () => void;
  onDelete: () => void;
}

function NavItemActions({ label, onRename, onDelete }: NavItemActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  function openMenu() {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 4, left: rect.right - 160 });
    setMenuOpen(true);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    function handleOutside(e: MouseEvent) {
      const t = e.target as Node;
      if (!triggerRef.current?.contains(t) && !dropdownRef.current?.contains(t)) {
        closeMenu();
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [menuOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (menuOpen) {
            closeMenu();
          } else {
            openMenu();
          }
        }}
        aria-label={`More options for ${label}`}
        className={cn(
          "flex-shrink-0 rounded p-0.5 transition-all",
          "text-on-surface-variant hover:text-on-surface",
          menuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        )}
      >
        <Icon icon={MoreVertical} size={14} />
      </button>

      {menuOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{ top: pos.top, left: pos.left }}
            className="border-outline-variant bg-surface-container-lowest fixed z-[9999] min-w-[160px] rounded-xl border shadow-md"
            role="menu"
          >
            <button
              role="menuitem"
              className="px-md py-sm text-body-sm text-on-surface hover:bg-surface-container-low flex w-full items-center gap-2 rounded-t-xl text-left transition-colors"
              onClick={() => {
                closeMenu();
                onRename();
              }}
            >
              <Icon icon={Pencil} size={13} />
              Rename
            </button>
            <div className="border-outline-variant/30 border-t" />
            <button
              role="menuitem"
              className="px-md py-sm text-body-sm text-error hover:bg-surface-container-low flex w-full items-center gap-2 rounded-b-xl text-left transition-colors"
              onClick={() => {
                closeMenu();
                setDeleteModalOpen(true);
              }}
            >
              <Icon icon={Trash2} size={13} />
              Delete
            </button>
          </div>,
          document.body,
        )}

      {createPortal(
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          taskTitle={label}
          onClose={() => {
            setDeleteModalOpen(false);
          }}
          onConfirm={() => {
            onDelete();
            setDeleteModalOpen(false);
          }}
        />,
        document.body,
      )}
    </>
  );
}

// ─── Project row ──────────────────────────────────────────────────────────────

interface ProjectRowProps {
  project: { _id: string; name: string };
  isActive: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onRenameConfirm: (name: string) => void;
  onRenameCancel: () => void;
  onRenameStart: () => void;
  onDelete: () => void;
}

function ProjectRow({
  project,
  isActive,
  isEditing,
  onSelect,
  onRenameConfirm,
  onRenameCancel,
  onRenameStart,
  onDelete,
}: ProjectRowProps) {
  if (isEditing) {
    return (
      <div className="gap-sm px-sm py-xs flex w-full items-center rounded-lg">
        <Icon icon={Folder} size={13} className="flex-shrink-0 opacity-60" />
        <InlineInput
          placeholder={project.name}
          initialValue={project.name}
          onConfirm={onRenameConfirm}
          onCancel={onRenameCancel}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "active-project-bar group flex w-full items-center rounded-lg transition-colors",
        isActive
          ? "bg-surface-container text-on-primary-fixed font-bold"
          : "text-on-primary-fixed hover:bg-surface-container hover:text-on-surface",
      )}
    >
      <Link
        href="/board"
        onClick={onSelect}
        className="gap-sm px-sm py-xs text-body-sm flex min-w-0 flex-1 items-center"
      >
        <Icon icon={Folder} size={13} className="flex-shrink-0 opacity-60" />
        <span className="flex-1 truncate">{project.name}</span>
      </Link>
      <NavItemActions label={project.name} onRename={onRenameStart} onDelete={onDelete} />
    </div>
  );
}

// ─── Team node ────────────────────────────────────────────────────────────────

interface TeamNodeProps {
  team: { _id: string; name: string };
  colorIndex: number;
  projects: Array<{ _id: string; name: string }>;
  isExpanded: boolean;
  isEditing: boolean;
  activeProjectId: string | null;
  editingProjectId: string | null;
  onToggle: () => void;
  onSelectProject: (projectId: string) => void;
  onAddProject: (teamId: string) => void;
  onRenameStart: () => void;
  onRenameConfirm: (name: string) => void;
  onRenameCancel: () => void;
  onDelete: () => void;
  onProjectRenameStart: (projectId: string) => void;
  onProjectRenameConfirm: (projectId: string, name: string) => void;
  onProjectRenameCancel: () => void;
  onProjectDelete: (projectId: string) => void;
}

function TeamNode({
  team,
  colorIndex: _colorIndex,
  projects,
  isExpanded,
  isEditing,
  activeProjectId,
  editingProjectId,
  onToggle,
  onSelectProject,
  onAddProject,
  onRenameStart,
  onRenameConfirm,
  onRenameCancel,
  onDelete,
  onProjectRenameStart,
  onProjectRenameConfirm,
  onProjectRenameCancel,
  onProjectDelete,
}: TeamNodeProps) {
  return (
    <div>
      <div className="group flex items-center">
        {isEditing ? (
          <div className="gap-sm px-sm py-xs text-body-sm flex min-w-0 flex-1 items-center">
            <Icon
              icon={isExpanded ? ChevronDown : ChevronRight}
              size={14}
              className="flex-shrink-0 opacity-50"
            />
            {/* <span className={cn("h-2.5 w-2.5 flex-shrink-0 rounded-full", dotColor)} /> */}
            <InlineInput
              placeholder={team.name}
              initialValue={team.name}
              onConfirm={onRenameConfirm}
              onCancel={onRenameCancel}
            />
          </div>
        ) : (
          <button
            onClick={onToggle}
            className="gap-sm px-sm py-xs text-body-sm text-on-primary-fixed hover:bg-surface-container hover:text-on-primary-fixed flex min-w-0 flex-1 items-center rounded-lg transition-colors"
          >
            <Icon
              icon={isExpanded ? ChevronDown : ChevronRight}
              size={14}
              className="flex-shrink-0 opacity-50"
            />
            {/* <span className={cn("h-2.5 w-2.5 flex-shrink-0 rounded-full", dotColor)} /> */}
            <Icon icon={Users} size={14} className="flex-shrink-0 opacity-80" />
            <span className="flex-1 truncate text-left">{team.name}</span>
          </button>
        )}

        {!isEditing && (
          <>
            <NavItemActions label={team.name} onRename={onRenameStart} onDelete={onDelete} />
            <button
              onClick={() => {
                onAddProject(team._id);
              }}
              aria-label={`Add project to ${team.name}`}
              className="text-on-surface-variant hover:text-on-surface mr-1 flex-shrink-0 rounded p-0.5 opacity-0 transition-all group-hover:opacity-100"
            >
              <Icon icon={Plus} size={14} />
            </button>
          </>
        )}
      </div>

      {/* Collapsible projects */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-150",
          isExpanded ? "max-h-[500px]" : "max-h-0",
        )}
      >
        <div className="mt-xs ml-8 flex flex-col gap-0.5">
          {projects.length === 0 ? (
            <span className="text-caption text-outline py-1 italic">No projects yet</span>
          ) : (
            projects.map((project) => (
              <ProjectRow
                key={project._id}
                project={project}
                isActive={activeProjectId === project._id}
                isEditing={editingProjectId === project._id}
                onSelect={() => {
                  onSelectProject(project._id);
                }}
                onRenameStart={() => {
                  onProjectRenameStart(project._id);
                }}
                onRenameConfirm={(name) => {
                  onProjectRenameConfirm(project._id, name);
                }}
                onRenameCancel={onProjectRenameCancel}
                onDelete={() => {
                  onProjectDelete(project._id);
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Team Spaces Section ──────────────────────────────────────────────────────

export function TeamSpacesSection() {
  const dispatch = useAppDispatch();
  const activeProjectId = useAppSelector((state) => state.workspace.activeProjectId);

  const { data: teams = [] } = useGetTeamsQuery(undefined);
  const { data: projects = [] } = useGetProjectsQuery(undefined);
  const [createTeam, { isLoading: isCreatingTeam }] = useCreateTeamMutation();
  const [createProject, { isLoading: isCreatingProject }] = useCreateProjectMutation();
  const [updateTeam] = useUpdateTeamMutation();
  const [deleteTeam] = useDeleteTeamMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();

  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
  const [addingTeam, setAddingTeam] = useState(false);
  const [addingProjectToTeam, setAddingProjectToTeam] = useState<string | null>(null);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const handleAddTeam = useCallback(
    async (name: string) => {
      setAddingTeam(false);
      await createTeam({ name });
    },
    [createTeam],
  );

  const handleAddProject = useCallback(
    async (name: string, teamId: string) => {
      setAddingProjectToTeam(null);
      const result = await createProject({ name, teamId });
      if ("data" in result && result.data !== undefined) {
        setExpandedTeams((prev) => new Set([...prev, teamId]));
        dispatch(setActiveProject(result.data._id));
      }
    },
    [createProject, dispatch],
  );

  function toggleTeam(teamId: string) {
    setExpandedTeams((prev) => {
      const next = new Set(prev);
      if (next.has(teamId)) next.delete(teamId);
      else next.add(teamId);
      return next;
    });
  }

  function handleSelectProject(projectId: string) {
    if (activeProjectId === projectId) dispatch(clearActiveProject());
    else dispatch(setActiveProject(projectId));
  }

  function handleMoreHoriz(teamId: string) {
    setExpandedTeams((prev) => new Set([...prev, teamId]));
    setAddingProjectToTeam(teamId);
  }

  const handleTeamRenameConfirm = useCallback(
    async (teamId: string, name: string) => {
      setEditingTeamId(null);
      await updateTeam({ id: teamId, name });
    },
    [updateTeam],
  );

  const handleTeamDelete = useCallback(
    async (teamId: string) => {
      if (activeProjectId) {
        const teamProjects = projects.filter((p) => p.teamId === teamId);
        if (teamProjects.some((p) => p._id === activeProjectId)) {
          dispatch(clearActiveProject());
        }
      }
      await deleteTeam(teamId);
    },
    [deleteTeam, projects, activeProjectId, dispatch],
  );

  const handleProjectRenameConfirm = useCallback(
    async (projectId: string, name: string) => {
      setEditingProjectId(null);
      await updateProject({ id: projectId, name });
    },
    [updateProject],
  );

  const handleProjectDelete = useCallback(
    async (projectId: string) => {
      if (activeProjectId === projectId) dispatch(clearActiveProject());
      await deleteProject(projectId);
    },
    [deleteProject, activeProjectId, dispatch],
  );

  return (
    <>
      {/* Section header */}
      <div className="px-md pb-xs pt-sm group flex items-center justify-between">
        <span className="text-label-caps text-on-primary-fixed-variant uppercase tracking-widest">
          Team Space
        </span>
        <IconButton
          icon={Plus}
          size={16}
          onClick={() => {
            setAddingTeam(true);
          }}
          aria-label="Add team"
        />
      </div>

      <div className="gap-xs flex flex-col px-1">
        {teams.map((team, index) => (
          <div key={team._id}>
            <TeamNode
              team={team}
              colorIndex={index}
              projects={projects.filter((p) => p.teamId === team._id)}
              isExpanded={expandedTeams.has(team._id)}
              isEditing={editingTeamId === team._id}
              activeProjectId={activeProjectId}
              editingProjectId={editingProjectId}
              onToggle={() => {
                toggleTeam(team._id);
              }}
              onSelectProject={handleSelectProject}
              onAddProject={handleMoreHoriz}
              onRenameStart={() => {
                setEditingTeamId(team._id);
              }}
              onRenameConfirm={(name) => void handleTeamRenameConfirm(team._id, name)}
              onRenameCancel={() => {
                setEditingTeamId(null);
              }}
              onDelete={() => void handleTeamDelete(team._id)}
              onProjectRenameStart={(projectId) => {
                setEditingProjectId(projectId);
              }}
              onProjectRenameConfirm={(projectId, name) =>
                void handleProjectRenameConfirm(projectId, name)
              }
              onProjectRenameCancel={() => {
                setEditingProjectId(null);
              }}
              onProjectDelete={(projectId) => void handleProjectDelete(projectId)}
            />
            {addingProjectToTeam === team._id && (
              <div className="ml-8 mt-2 pr-1">
                <InlineInput
                  placeholder="Project name…"
                  isLoading={isCreatingProject}
                  onConfirm={(name) => {
                    void handleAddProject(name, team._id);
                  }}
                  onCancel={() => {
                    setAddingProjectToTeam(null);
                  }}
                />
              </div>
            )}
          </div>
        ))}

        {addingTeam && (
          <div className="px-sm">
            <InlineInput
              placeholder="Team name…"
              isLoading={isCreatingTeam}
              onConfirm={(name) => {
                void handleAddTeam(name);
              }}
              onCancel={() => {
                setAddingTeam(false);
              }}
            />
          </div>
        )}

        {teams.length === 0 && !addingTeam && (
          <span className="text-caption text-outline px-md py-1 italic">No teams yet</span>
        )}
      </div>
    </>
  );
}
